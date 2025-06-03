#pragma once

#include <string>
#include <windows.h>
#include <sddl.h>
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace Auth {

    std::string baseUrl = "http://127.0.0.1:3000";

    std::string GetPcSid() {
        HANDLE token = nullptr;
        if (!OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &token)) return "UNKNOWN";

        DWORD size = 0;
        GetTokenInformation(token, TokenUser, nullptr, 0, &size);

        std::vector<BYTE> buffer(size);
        if (!GetTokenInformation(token, TokenUser, buffer.data(), size, &size)) {
            CloseHandle(token);
            return "UNKNOWN";
        }

        TOKEN_USER* user = reinterpret_cast<TOKEN_USER*>(buffer.data());
        LPSTR sidStr;
        if (!ConvertSidToStringSidA(user->User.Sid, &sidStr)) {
            CloseHandle(token);
            return "UNKNOWN";
        }

        std::string sid(sidStr);
        LocalFree(sidStr);
        CloseHandle(token);
        return sid;
    }

    std::string Register(const std::string& username, const std::string& password, const std::string& key, std::string& message) {
        json payload = {
            {"username", username},
            {"password", password},
            {"key", key},
            {"hwid", GetPcSid()}
        };

        auto response = cpr::Post(
            cpr::Url{ baseUrl + "/auth/register" },
            cpr::Header{{"Content-Type", "application/json"}},
            cpr::Body{ payload.dump() }
        );

        message = response.text;
        return response.status_code == 200 ? "success" : "fail";
    }

    std::string Login(const std::string& username, const std::string& password, std::string& message) {
        json payload = {
            {"username", username},
            {"password", password},
            {"hwid", GetPcSid()}
        };

        auto response = cpr::Post(
            cpr::Url{ baseUrl + "/auth/login" },
            cpr::Header{{"Content-Type", "application/json"}},
            cpr::Body{ payload.dump() }
        );

        message = response.text;
        return response.status_code == 200 ? "success" : "fail";
    }
}
