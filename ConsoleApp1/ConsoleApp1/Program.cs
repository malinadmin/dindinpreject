using System;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            Person p = new Person();
            Console.WriteLine(p.name);
            Console.WriteLine("马林");
            Console.ReadKey();
        }
    }

    public class Person
    {
        public string name { get; } = "马林";
    }
}
