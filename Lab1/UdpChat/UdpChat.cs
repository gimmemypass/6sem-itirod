using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Linq;

namespace UdpChat
{
    internal class UdpChat
    {
        private static string _name;
        
        private static Socket _socket;
        private static IPEndPoint _remotePoint;
        private static int _localPort;
        private static int _remotePort;

        public static void Main(string[] args)
        {

            try
            {
                Console.WriteLine("Enter your username : ");
                _name = Console.ReadLine();

                Console.WriteLine("Enter the sending port : ");
                _remotePort = int.Parse(Console.ReadLine() ?? throw new Exception("are you a tupiza?"));
                
                Console.WriteLine("Enter the receiving port : ");
                _localPort = int.Parse(Console.ReadLine() ?? throw new Exception("are you a tupiza?"));
                
                Console.WriteLine("Welcome to the club, body");

                _socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                _remotePoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), _remotePort);

                var receiverThread = new Thread(ReceiveData);
                receiverThread.Start();

                while (true)
                {
                    var message = Console.ReadLine();
                    SendMessage(message);
                }
            }
            catch (Exception error)
            {
                Console.WriteLine($"[UdpChat] Start() : Shit happens : {error.Message}");
            }
        }

        private static void  ReceiveData()
        {
            try
            {
                var listenerSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp); 
                var localPoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), _localPort); 
                listenerSocket.Bind(localPoint);
                
                var login = new PacketData(PacketData.DataIdentifier.LogIn, _name, null);
                _socket.SendTo(login.GetByteArray(), _remotePoint);

             
                while (true)
                {
                    var data = new byte[256];
    
                    var message = new StringBuilder();
                       
                    EndPoint remotePoint = new IPEndPoint(IPAddress.Any, 0);
                    var name = ""; 
                    do
                    {
                        listenerSocket.ReceiveFrom(data, ref remotePoint);
                        var packet = new PacketData(data);

                        if (packet.dataIdentifier == PacketData.DataIdentifier.LogIn)
                        {
                            PrintLogIn(packet.name);    
                            break;
                        }

                        if (!IsHashEqual(packet))
                        {
                            PrintError("It looks like the message was broken");
                            break;
                        }
                        message.Append(packet.message);

                        if (string.IsNullOrEmpty(name)) name = packet.name;
                        
                    } while (listenerSocket.Available > 0);
                    if(!string.IsNullOrEmpty(message.ToString()))
                        Console.WriteLine($"[{name}] : {message}");
                }

            }
            catch (Exception error)
            {
                Console.WriteLine($"[UdpChat] ReceiveData() : {error.Message}"); 
            }
        }

        private static void PrintError(string error)
        {
            Console.WriteLine($"[[{error}]]"); 
        }

        private static bool IsHashEqual(PacketData packet)
        {
            var received = packet.hash;
            var calculated = packet.CalculateMD5();
            return received.SequenceEqual(calculated);
        }
        

        private static void PrintLogIn(string name)
        {
            Console.WriteLine($"[{name}] just logged in. Say 'hi!' ");
        }

        private static void SendMessage(string message)
        {
            var data = new PacketData(PacketData.DataIdentifier.Message, _name, message);
            var bytes = data.GetByteArray();
            _socket.SendTo(bytes, _remotePoint);
        }

    }
}