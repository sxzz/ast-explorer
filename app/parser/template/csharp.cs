using System;
using System.Collections.Generic;

namespace Example
{
    public class HelloWorld
    {
        private List<string> names;

        public HelloWorld()
        {
            names = new List<string>();
        }

        public void AddName(string name)
        {
            names.Add(name);
        }

        public IEnumerable<string> GetNames()
        {
            return new List<string>(names);
        }

        public static void Main(string[] args)
        {
            var hello = new HelloWorld();
            hello.AddName("World");
            Console.WriteLine($"Hello, {hello.GetNames()}!");
        }
    }
}
