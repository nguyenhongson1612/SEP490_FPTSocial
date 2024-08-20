using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CheckingBadWord
    {
        public List<BannedWord> Compare2String(string inputSentence)
        {
            string projectDirectory = Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName;
            string relativePath = Path.Combine("bannedWords.json");
            string fullPath = Path.Combine(projectDirectory, relativePath);

            List<BannedWord> bannedKeywords = ReadFromJson(fullPath);
            var detectedKeywords = DetectBannedKeywords(inputSentence, bannedKeywords);

            return detectedKeywords;
        }

        private List<BannedWord> ReadFromJson(string filePath)
        {
            string json = File.ReadAllText(filePath);
            var bannedWordsDictionary = JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(json);

            var bannedWords = new List<BannedWord>();
            foreach (var category in bannedWordsDictionary)
            {
                foreach (var word in category.Value)
                {
                    bannedWords.Add(new BannedWord { Word = word, Category = category.Key });
                }
            }

            return bannedWords;
        }

        private List<BannedWord> DetectBannedKeywords(string sentence, List<BannedWord> bannedKeywords)
        {
            var detectedKeywords = new List<BannedWord>();

            foreach (var keyword in bannedKeywords)
            {
                // Chuyển cả mẫu và văn bản về chữ thường trước khi tìm kiếm
                if (KMPSearch(keyword.Word.ToLower(), sentence.ToLower()))
                {
                    detectedKeywords.Add(keyword);
                }
            }

            return detectedKeywords;
        }

        private bool KMPSearch(string pattern, string text)
        {
            int m = pattern.Length;
            int n = text.Length;

            int[] lps = new int[m];
            int j = 0;

            ComputeLPSArray(pattern, m, lps);

            int i = 0;
            while (i < n)
            {
                if (pattern[j] == text[i])
                {
                    j++;
                    i++;
                }

                if (j == m)
                {
                    return true;
                    j = lps[j - 1];
                }
                else if (i < n && pattern[j] != text[i])
                {
                    if (j != 0)
                    {
                        j = lps[j - 1];
                    }
                    else
                    {
                        i++;
                    }
                }
            }

            return false;
        }

        private void ComputeLPSArray(string pattern, int m, int[] lps)
        {
            int len = 0;
            int i = 1;
            lps[0] = 0;

            while (i < m)
            {
                if (pattern[i] == pattern[len])
                {
                    len++;
                    lps[i] = len;
                    i++;
                }
                else
                {
                    if (len != 0)
                    {
                        len = lps[len - 1];
                    }
                    else
                    {
                        lps[i] = 0;
                        i++;
                    }
                }
            }
        }

        public class BannedWord
        {
            public string Word { get; set; }
            public string Category { get; set; }
        }

        public string MarkBannedWordsInContent(string sentence, List<BannedWord> bannedKeywords)
        {
            // Tạo một StringBuilder để xây dựng lại câu với các từ bị cấm được đánh dấu
            var stringBuilder = new StringBuilder();

            // Duyệt qua từng từ trong câu
            int currentIndex = 0;
            while (currentIndex < sentence.Length)
            {
                bool foundBannedWord = false;

                // Kiểm tra từng từ bị cấm
                foreach (var keyword in bannedKeywords)
                {
                    // So sánh không phân biệt hoa thường
                    string keywordLower = keyword.Word.ToLower();
                    string currentWord = sentence.Substring(currentIndex, Math.Min(keywordLower.Length, sentence.Length - currentIndex)).ToLower();

                    if (currentWord == keywordLower)
                    {
                        // Nếu tìm thấy từ bị cấm, đánh dấu nó và thêm vào StringBuilder
                        stringBuilder.Append($"<mark>{sentence.Substring(currentIndex, keywordLower.Length)}</mark>");
                        currentIndex += keywordLower.Length;
                        foundBannedWord = true;
                        break;
                    }
                }

                // Nếu không tìm thấy từ bị cấm, thêm ký tự hiện tại vào StringBuilder
                if (!foundBannedWord)
                {
                    stringBuilder.Append(sentence[currentIndex]);
                    currentIndex++;
                }
            }

            return stringBuilder.ToString();
        }
    }
}
