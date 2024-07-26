using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ChatEngineService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ChatEngineService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> CreateUserAsync(string username, string email, string firstname, string lastname, string avata)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.chatengine.io/users/");
            request.Headers.Add("Private-Key", _configuration["ChatEngine:PrivateKey"]);

            var user = new
            {
                username = username,
                secret = username,
                email = email,
                first_tname = firstname,
                last_name = lastname,
                new_avata = avata
            };

            request.Content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }

}
