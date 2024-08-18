using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
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
                if (KMPSearch(keyword.Word, sentence))
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
            foreach (var keyword in bannedKeywords)
            {
                sentence = MarkKeyword(sentence, keyword.Word);
            }

            return sentence;
        }

        private string MarkKeyword(string sentence, string keyword)
        {
            if (KMPSearch(keyword, sentence))
            {
                string highlightedKeyword = $"<mark>{keyword}</mark>";
                sentence = System.Text.RegularExpressions.Regex.Replace(sentence, keyword, highlightedKeyword, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            }

            return sentence;
        }

        private string ReplaceWholeWord(string sentence, string word, string replacement)
        {
            return System.Text.RegularExpressions.Regex.Replace(sentence, $"\\b{System.Text.RegularExpressions.Regex.Escape(word)}\\b", replacement, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        }
    }
}
