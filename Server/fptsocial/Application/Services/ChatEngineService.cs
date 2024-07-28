﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
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
            if (!string.IsNullOrEmpty(avata))
            {
                var imageUrl = avata;

                // Tải ảnh từ URL
                var imageResponse = await _httpClient.GetAsync(imageUrl);
                if (!imageResponse.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to download image.");
                }
                var imageStream = await imageResponse.Content.ReadAsStreamAsync();

                // Tạo nội dung multipart/form-data
                using (var content = new MultipartFormDataContent())
                {
                    content.Add(new StringContent(username), "username");
                    content.Add(new StringContent(username), "secret");
                    content.Add(new StringContent(email), "email");
                    content.Add(new StringContent(firstname), "first_name");
                    content.Add(new StringContent(lastname), "last_name");
                    content.Add(new StringContent("true"), "is_online");

                    var imageContent = new StreamContent(imageStream);
                    imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
                    content.Add(imageContent, "avatar", "avatar.jpg");

                    // Tạo yêu cầu POST
                    var request = new HttpRequestMessage(HttpMethod.Post, "https://api.chatengine.io/users/");
                    request.Headers.Add("Private-Key", _configuration["ChatEngine:PrivateKey"]);
                    request.Content = content;

                    // Gửi yêu cầu
                    var response = await _httpClient.SendAsync(request);
                    response.EnsureSuccessStatusCode();

                    return await response.Content.ReadAsStringAsync();
                }
            }
            else
            {
                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.chatengine.io/users/");
                request.Headers.Add("Private-Key", _configuration["ChatEngine:PrivateKey"]);

                var user = new
                {
                    username = username,
                    secret = secrt,
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

        public async Task<string> CreateChatAsync(string title, string username)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.chatengine.io/chats/");
            request.Headers.Add("Private-Key", _configuration["ChatEngine:PrivateKey"]);
            request.Headers.Add("User-Name", username);
            request.Headers.Add("User-Secret", username);

            var chat = new
            {
                title = title,
                is_direct_chat = false
            };

            request.Content = new StringContent(JsonConvert.SerializeObject(chat), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            if (response.StatusCode == HttpStatusCode.Forbidden)
            {
                throw new Exception("Access Forbidden: Ensure your Private Key is correct.");
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> AddMemberToChatAsync(string username,string id, string uname)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"https://api.chatengine.io/chats/{id}"+"/people/");
            request.Headers.Add("Private-Key", _configuration["ChatEngine:PrivateKey"]);
            request.Headers.Add("User-Name", uname);
            request.Headers.Add("User-Secret", uname);
            var chat = new
            {
                username = username,
            };

            request.Content = new StringContent(JsonConvert.SerializeObject(chat), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            if (response.StatusCode == HttpStatusCode.Forbidden)
            {
                throw new Exception("Access Forbidden: Ensure your Private Key is correct.");
            }

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

    }

}
