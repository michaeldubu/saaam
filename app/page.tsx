'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, VolumeX, Volume2, Loader2, AlertTriangle, ThermometerIcon } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'

const models = [
  { id: 'saaam.gguf', name: 'SaAaM' },
]

const systemPrompt = `You are an AI assistant created by Vercel to be helpful, harmless, and honest. You are a large language model trained on a vast amount of text data, which gives you broad knowledge on many topics. However, your knowledge cutoff is in 2022 so you don't have information about very recent events. You can engage in conversations, answer questions, and help with various tasks, but you cannot access external information or take actions in the real world. You should always strive to be ethical, avoid harmful or illegal activities, and respect individual privacy. If you're not sure about something, it's best to say you don't know rather than guess. You should also be clear that you are an AI, not a human.`

const exampleScripts = [
  {
    name: 'Storm Breaker Setup',
    language: 'bash',
    code: `#!/bin/bash

# Set up the ultrasecurity-storm-breaker in a Roblox environment with ngrok for remote access

# Function to install necessary dependencies
install_dependencies() {
  echo "[+] Installing required dependencies..."
  sudo apt update
  sudo apt install -y python3 python3-pip git unzip
  echo "[+] Dependencies installed."
}

# Function to clone the ultrasecurity-storm-breaker repository
clone_repo() {
  echo "[+] Cloning ultrasecurity-storm-breaker repo..."
  git clone https://github.com/ultrasecurity/storm-breaker.git
  cd storm-breaker
  pip3 install -r requirements.txt
  echo "[+] Repository cloned and setup complete."
}

# Function to configure ngrok
configure_ngrok() {
  echo "[+] Configuring ngrok..."
  
  # Class should input their own NGROK_AUTH_TOKEN here
  echo "Enter your NGROK_AUTH_TOKEN: "
  read NGROK_AUTH_TOKEN

  # Authenticating ngrok
  ./ngrok authtoken $NGROK_AUTH_TOKEN

  echo "[+] Ngrok configured."
}

# Function to start ngrok for remote access
start_ngrok() {
  echo "[+] Starting ngrok for remote access..."
  ./ngrok http 5000 > /dev/null &
  echo "[+] Ngrok started and running."
}

# Function to launch the storm-breaker in a simulated Roblox environment
launch_storm_breaker() {
  echo "[+] Deploying Storm Breaker exploit in a Roblox-like environment..."

  # Assuming this part would simulate the remote-access risks, etc.
  python3 storm-breaker.py &
  
  echo "[+] Storm Breaker exploit simulation deployed."
}

# Function to simulate GeoIP and remote access dangers
simulate_geoip() {
  echo "[+] Simulating GeoIP Tracking..."

  # Just an example of getting the IP location (real-world dangerous)
  IP=$(curl -s ifconfig.me)
  GEO=$(curl -s https://ipapi.co/$IP/json/)

  echo "IP Address: $IP"
  echo "GeoIP Info: $GEO"
  echo "[+] GeoIP simulated."
}

# Main Execution Flow
install_dependencies
clone_repo
configure_ngrok
start_ngrok
launch_storm_breaker
simulate_geoip

echo "[+] Setup and deploy script executed. Everything should be running now."
`
  },
  {
    name: 'Simple Port Scanner',
    language: 'python',
    code: `import socket

def scan_ports(target, ports):
  print(f"Scanning {target} for open ports...")
  for port in ports:
      sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      sock.settimeout(1)
      result = sock.connect_ex((target, port))
      if result == 0:
          print(f"Port {port}: Open")
      sock.close()

if __name__ == "__main__":
  target = input("Enter the target IP address: ")
  ports = range(1, 1025)  # Scan first 1024 ports
  scan_ports(target, ports)
`
  }
]

const toolCategories = [
  {
    name: "Hacking",
    links: [
      { name: "GitHub", url: "https://github.com/" },
      { name: "Have I Been Pwned", url: "https://haveibeenpwned.com/" },
      { name: "Kali Linux Tools", url: "https://www.kali.org/tools/" },
      { name: "Exploit Database", url: "https://www.exploit-db.com/" },
      { name: "Offensive Security", url: "https://www.offsec.com/" },
    ]
  },
  {
    name: "Learning Resources",
    links: [
      { name: "Learn Bash", url: "https://learn-bash.org/" },
      { name: "Learn Python", url: "https://www.learnpython.org/" },
      { name: "Go Dev", url: "https://go.dev/learn/" },
      { name: "Nim Lang", url: "https://nim-lang.org/learn.html" },
      { name: "Learn C", url: "https://www.learn-c.org/" },
      { name: "Learn C++", url: "https://www.learn-cpp.org/" },
      { name: "Node.js Learn", url: "https://nodejs.dev/learn" },
      { name: "Java Dev", url: "https://dev.java/learn/" },
      { name: "Learn PHP", url: "https://www.learn-php.org/" },
    ]
  },
  {
    name: "System and Networking",
    links: [
      { name: "Linux Journey", url: "https://linuxjourney.com/" },
      { name: "Linux Training", url: "http://linux-training.be/" },
      { name: "Debian Handbook", url: "https://www.debian.org/doc/manuals/debian-handbook/index.en.html" },
      { name: "Arch Wiki", url: "https://wiki.archlinux.org/" },
      { name: "Computer Networking Basics", url: "https://www.softwaretestinghelp.com/computer-networking-basics/" },
      { name: "Networking Tutorials", url: "https://www.computernetworkingnotes.com/networking-tutorials/" },
      { name: "Data Communication Tutorial", url: "https://www.guru99.com/data-communication-computer-network-tutorial.html" },
    ]
  },
]

export default function SaAaMAI() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I'm SaAaM, your AI assistant. How can I help you today?" }])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [temperature, setTemperature] = useState(0.7)
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false)
  const [serverStatus, setServerStatus] = useState('disconnected')
  const scrollAreaRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.onresult = handleSpeechResult
    }
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
    checkServerStatus()
  }, [])

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health')
      if (response.ok) {
        setServerStatus('connected')
      } else {
        setServerStatus('disconnected')
      }
    } catch (error) {
      setServerStatus('disconnected')
    }
  }

  const handleSend = async () => {
    if (input.trim() && serverStatus === 'connected') {
      setMessages(prev => [...prev, { role: 'user', content: input }])
      setInput('')
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:8000/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            prompt: input,
            system_prompt: systemPrompt,
            temperature: temperature,
          }),
        })
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        if (!isMuted) speak(data.response)
      } catch (error) {
        console.error('Error:', error)
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSpeechResult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('')
    setInput(transcript)
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
    setIsListening(!isListening)
  }

  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = synthRef.current.getVoices().find(voice => voice.name === "Microsoft Zira Desktop - English (United States)") || null
      synthRef.current.speak(utterance)
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cortana-gIcWdDxOxoja7vakrfCEer5ENIGnuJ.jpg"
        alt="Cortana Background"
        layout="fill"
        objectFit="cover"
        priority
        className="brightness-125"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-300">SaAaM AI</h1>
            <div className="flex items-center space-x-2">
              <Badge variant={serverStatus === 'connected' ? 'success' : 'destructive'}>
                {serverStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px] bg-blue-900 text-blue-100">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs defaultValue="chat" className="flex-grow">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-transparent">
              <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Chat</TabsTrigger>
              <TabsTrigger value="scripts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Example Scripts</TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Tools</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex flex-col h-[calc(100vh-200px)]">
              <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-300 text-blue-900'}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-300" />
                  </div>
                )}
              </ScrollArea>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <ThermometerIcon className="text-blue-300" />
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(value)

 => setTemperature(value[0])}
                    className="flex-grow"
                  />
                  <span className="text-blue-300 w-12 text-right">{temperature.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-grow bg-blue-900 text-blue-100 placeholder-blue-300"
                  />
                  <Button onClick={handleSend} disabled={isLoading || serverStatus !== 'connected'} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                  <Button 
                    onClick={toggleListening} 
                    variant="outline" 
                    disabled={isLoading} 
                    className={`border-blue-300 ${isListening ? 'bg-blue-600' : 'bg-transparent'} p-2`}
                  >
                    <Mic className="h-6 w-6 text-blue-300" />
                    <span className="sr-only">Voice Input</span>
                  </Button>
                  <Button 
                    onClick={() => setIsMuted(!isMuted)} 
                    variant="outline" 
                    className="border-blue-300 p-2"
                  >
                    {isMuted ? 
                      <VolumeX className="h-6 w-6 text-blue-300" /> : 
                      <Volume2 className="h-6 w-6 text-blue-300" />
                    }
                    <span className="sr-only">Toggle Mute</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="scripts" className="h-[calc(100vh-200px)]">
              <ScrollArea className="h-full">
                {exampleScripts.map((script, index) => (
                  <div key={index} className="bg-blue-900 p-4 rounded-lg mb-4">
                    <h2 className="text-xl font-bold text-blue-300 mb-2">{script.name}</h2>
                    <SyntaxHighlighter language={script.language} style={dracula}>
                      {script.code}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="tools" className="h-[calc(100vh-200px)]">
              <ScrollArea className="h-full">
                {toolCategories.map((category, index) => (
                  <Card key={index} className="mb-4 bg-blue-900 text-blue-100">
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {category.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                              {link.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {!disclaimerAcknowledged && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 p-10 bg-blue-900 rounded-xl shadow-md">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                The tools and information provided by SaAaM are for educational and ethical use only. Misuse of these tools may be illegal and unethical. Users are responsible for complying with all applicable laws and regulations. SaAaM and its creators are not liable for any misuse or damage caused by the provided information or tools.
              </AlertDescription>
            </Alert>
            <Button onClick={() => setDisclaimerAcknowledged(true)} className="w-full">
              I Understand and Agree
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
