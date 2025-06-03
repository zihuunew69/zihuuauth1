using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Security.Principal;

namespace aimguard
{
    public static class Auth
    {
        private static readonly HttpClient client = new HttpClient();
        private static readonly string baseUrl = "http://127.0.0.1:3000";

        public static async Task<(bool success, string message)> Register(string username, string password, string key)
        {
            string pcSid = GetPcSid();

            var payload = new
            {
                username = username,
                password = password,
                key = key,
                hwid = pcSid
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync($"{baseUrl}/auth/register", content);
                var responseString = await response.Content.ReadAsStringAsync();

                string msg = "Unknown error";
                try
                {
                    var json = JObject.Parse(responseString);
                    msg = json["msg"]?.ToString() ?? msg;
                }
                catch { }

                return (response.IsSuccessStatusCode, msg);
            }
            catch (Exception ex)
            {
                return (false, "Register error: " + ex.Message);
            }
        }

        public static async Task<(bool success, string message)> Login(string username, string password)
        {
            string pcSid = GetPcSid();

            var payload = new
            {
                username = username,
                password = password,
                hwid = pcSid
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync($"{baseUrl}/auth/login", content);
                var responseString = await response.Content.ReadAsStringAsync();

                string msg = "Unknown error";
                try
                {
                    var json = JObject.Parse(responseString);
                    msg = json["msg"]?.ToString() ?? msg;
                }
                catch { }

                return (response.IsSuccessStatusCode, msg);
            }
            catch (Exception ex)
            {
                return (false, "Login error: " + ex.Message);
            }
        }

        public static string GetPcSid()
        {
            try
            {
                WindowsIdentity identity = WindowsIdentity.GetCurrent();
                return identity.User.Value;
            }
            catch
            {
                return "UNKNOWN";
            }
        }
    }
}
