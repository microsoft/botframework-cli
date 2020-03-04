// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace LUISGenTest
{
    public class TestUtilities
    {
        private static Lazy<Dictionary<string, string>> environmentKeys = new Lazy<Dictionary<string, string>>(() =>
        {
            try
            {
                return File.ReadAllLines(@"\\fusebox\private\sdk\UnitTestKeys.cmd")
                    .Where(l => l.StartsWith("@set"))
                    .Select(l => l.Replace("@set ", "").Split('='))
                    .ToDictionary(pairs => pairs[0], pairs => pairs[1]);
            }
            catch (Exception err)
            {
                System.Diagnostics.Debug.WriteLine(err.Message);
                return new Dictionary<string, string>();
            }
        });

        public static string GetKey(string key, string defaultValue)
        {
            if (!environmentKeys.Value.TryGetValue(key, out var value))
            {
                // fallback to environment variables
                value = Environment.GetEnvironmentVariable(key);
                if (string.IsNullOrWhiteSpace(value))
                {
                    value = defaultValue;
                }
            }
            return value;
        }
    }
}
