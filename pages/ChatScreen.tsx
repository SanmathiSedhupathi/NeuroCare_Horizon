import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Sentiment from 'sentiment';
import translate from 'google-translate-api-x';
import Voice from 'react-native-voice';
import * as Speech from 'expo-speech';
import { Dimensions } from "react-native";
import { WebView } from 'react-native-webview';
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
// @ts-ignore
import ImageBase64 from 'react-native-image-base64';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const screenWidth = Dimensions.get("window").width;

const API_KEY = 'aFnAMxjTpGEhu0LAmbGz5mQiGxaCLNZpvdtcjltf'; // Replace with actual API key
const EMERGENCY_CONTACT = '+1234567890'; // Replace with actual emergency contact

// Message Type
type Message = {
    text: string;
    sender: 'user' | 'bot';
};

// Supported languages
const LANGUAGES = {
    English: 'en',
    Spanish: 'es',
    French: 'fr',
    Tamil: 'ta',
    Hindi: 'hi',
    German: 'de',
    Chinese: 'zh',
    Arabic: 'ar'
};
let prevHappyScore: number | null = null;
let prevNeutralScore: number | null = null;
let prevSadScore: number | null = null;
let moodHistory: { timestamp: number, sadScore: number, happyScore: number, neutralScore: number }[] = [];

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | string>('en'); // Default to English
    const [translateEnabled, setTranslateEnabled] = useState<boolean>(false); // Toggle translation
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Moved inside the component
    const [emotionCounts, setEmotionCounts] = useState({
        happiness: 0,
        sadness: 0,
        neutral: 0,
        anger: 0,
        disgust: 0,
        fear: 0,
        surprise: 0,
    });
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    useEffect(() => {
        loadChatHistory();
        Voice.onSpeechResults = onSpeechResults;
        return () => {
            Voice.destroy();
        };
    }, []);

    const analyzeMood = (message: string) => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(message);

        let sadScore = 0, happyScore = 0, neutralScore = 0;

        if (result.score < 0) sadScore = Math.abs(result.score);
        else if (result.score > 0) happyScore = result.score;
        else neutralScore = 1; // Neutral response

        return { sadScore, happyScore, neutralScore };
    };

    const getJournalEntries = async (): Promise<string> => {
        try {
            const entries = await AsyncStorage.getItem('journalEntries');
            if (entries) {
                const parsedEntries = JSON.parse(entries);
                return parsedEntries.map((entry: { text: string }) => `📖 ${entry.text}`).join("\n\n");
            }
            return "No journal entries yet.";
        } catch (error) {
            console.error('Error retrieving journal:', error);
            return "Couldn't retrieve journal entries.";
        }
    };

    const loadChatHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('chatHistory');
            if (history) setMessages(JSON.parse(history));
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const sendEmergencyEmail = async (userEmail: string) => {
        try {
            await fetch("http://192.168.146.17:5000/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: "thejusu.22msc@kongu.edu", // Replace with actual emergency contact
                    subject: "🚨 Urgent: Possible Suicidal Thoughts Detected",
                    text: `We've noticed some distressing messages from ${userEmail}. Please check in with them as soon as possible—they might need your support. Your timely response could make a real difference. 💙`,
                }),
            });

            console.log("Emergency email sent!");
        } catch (error) {
            console.error("Error sending emergency email:", error);
        }
    };

    const saveChatHistory = async (chat: Message[]) => {
        try {
            await AsyncStorage.setItem('chatHistory', JSON.stringify(chat));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };
    const userEmail = "sanmathisedhupathi2004@gmail.com";
    const userHobbies = "reading, painting, and hiking"; // Replace with actual hobbies

    const getAIResponse = async (userMessage: string): Promise<string> => {
        try {
            const { sadScore, happyScore, neutralScore } = analyzeMood(userMessage);
            moodHistory.push({ sadScore, happyScore, neutralScore, timestamp: Date.now() });

            prevSadScore = sadScore;
            prevHappyScore = happyScore;
            prevNeutralScore = neutralScore;

            const journalEntries = await getJournalEntries();

            const fullConversation = messages
                .slice(-6)
                .map(msg => `${msg.sender}: ${msg.text}`)
                .join("\n");

            const mood = detectMood(userMessage);

            let extraContent = "";
            let videoUrl = "";
            if (mood === "sad") {
                videoUrl = await getRandomVideo();
            } else if (mood === "happy") {
                extraContent = `\nHere's something to cheer you more and more : ${await getRandomJoke()} 😂`;
            } else if (mood === "bored") {
                extraContent = `\nFeeling bored? Try this fun fact: ${await getRandomFunFact()}`;
            }

            const prompt = `
            You’re the user's best friend. Reply **super short (max 10 words).**
            You are the user's best friend. Be **chill, fun, and friendly**—talk like a close friend. 
            You should give short answers and ask questions to keep the conversation going.
            You understand **internet slang**, memes, and casual lingo. Keep replies **engaging but not robotic**. 
            Respond naturally, and don’t cut off mid-sentence. **Make responses flow naturally.** 
            **Rules:**  
            - **Give very short replies.(10 words)**
            - **If users feel down, cheer them up with jokes, fun facts, or videos. add external links for video**
            - **If users are happy, celebrate with them.**
            - **Address yourself as "Comrade"** in all responses.  
            - **No robotic speech**, keep responses flowing naturally.  
            - **Use emojis only when they fit the vibe.**  
            - **Never address yourself as a bot, model or technology.**
            - **Don’t cut off mid-sentence.**
            - **No overly formal or generic answers.**
            - **Use humor and be playful.**
            - **never mention them as User in the response.**
            - ** MOST IMPORTANTLY, It should be a short messages similar to huamn conversation.**
            
            User's Hobbies:
            ---
            ${userHobbies}
            ---

            ${journalEntries ? `If the user's message relates to their past journal entries, reference them naturally. Otherwise, don't mention them.` : ''}

            **Keep it real and personal. Use emojis only when they add to the vibe.**  
            Don't overuse them. No overly formal or generic answers.

            **Example:**
            User: "yo, feeling meh today"
            Friend: "Ayy, what’s up? Meh days happen, but you got this. Wanna talk about it? 👀"

            **Ongoing Conversation:**  
            ${fullConversation}

            User: "${userMessage}"
            Friend: ${extraContent}
            `;

            const response = await axios.post(
                'https://api.cohere.ai/v1/generate',
                {
                    model: 'command',
                    prompt: prompt,
                    max_tokens: 200,
                    temperature: 0.85,
                    stop_sequences: ["User:", "Friend:"],
                },
                { headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
            );

            const aiResponse = response.data.generations[0].text.trim();
            return aiResponse + (videoUrl ? `\nWatch this: ${videoUrl}` : extraContent);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return "Uh-oh, something glitched! But hey, I'm still here. Talk to me! 😄";
        }
    };
    const checkForSuicidalContent = (message: string): boolean => {
        const suicidalKeywords = ["want to die", "end my life", "suicide", "no reason to live"];
        return suicidalKeywords.some((word) => message.toLowerCase().includes(word));
    };
    const detectMood = (message: string): string => {
        const lowerMsg = message.toLowerCase();

        if (/(\bsad\b|\bdepressed\b|\bdown\b)/.test(lowerMsg)) return "sad";
        if (/(\bhappy\b|\bexcited\b|\bjoyful\b)/.test(lowerMsg)) return "happy";
        if (/(\bbored\b|\bnothing to do\b|\bso dull\b)/.test(lowerMsg)) return "bored";

        return "neutral";
    };

    const getRandomJoke = async (): Promise<string> => {
        const jokes = [
            "Why don’t skeletons fight each other? They don’t have the guts. 😂",
            "Parallel lines have so much in common. It’s a shame they’ll never meet. 😆",
            "I told my wife she should embrace her mistakes. She gave me a hug. 😅"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        console.log("Selected Joke:", joke);
        return joke;
    };

    const getRandomVideo = async (): Promise<string> => {
        const youtubeVideos = [
            "https://www.youtube.com/watch?v=zVUD2eyKt-k",
            "https://www.youtube.com/watch?v=UwGSgJytufY",
            "https://www.youtube.com/watch?v=JJ9GD0SiwEc"
        ];
        return youtubeVideos[Math.floor(Math.random() * youtubeVideos.length)];
    };

    const getRandomFunFact = async (): Promise<string> => {
        return "We have a variety of fun games to keep you entertained! 🎮✨\n\n" +
               "1️⃣ 🐍 Snake Game\n" +
               "2️⃣ 🫧 Bubble Wrapper\n" +
               "3️⃣ 🎶 Music Palette";
    };
    const analyzeSentiment = (text: string): keyof typeof emotionCounts => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
    
        // Custom emotion keywords
        const emotionKeywords = {
            happiness: ["happy", "joy", "excited", "great", "amazing", "love"],
            sadness: ["sad", "depressed", "down", "unhappy", "cry", "heartbroken"],
            anger: ["angry", "mad", "furious", "rage", "annoyed", "irritated"],
            disgust: ["disgusted", "gross", "nauseous", "repulsed", "sick"],
            fear: ["scared", "afraid", "fearful", "nervous", "anxious", "worried"],
            surprise: ["surprised", "shocked", "amazed", "astonished", "wow"],
            neutral: [], // Neutral has no specific keywords
        };
    
        // Check for emotion keywords in the text
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
                return emotion as keyof typeof emotionCounts;
            }
        }
    
        // Fallback to sentiment score if no keywords match
        if (result.score > 2) {
            return "happiness";
        } else if (result.score < -2) {
            return "sadness";
        } else {
            return "neutral";
        }
    };
    const checkMoodEvery2Minutes = async () => {
        const now = Date.now();
        
        const recentEntry = moodHistory.find(entry => now - entry.timestamp >= 120000); 
    
        if (recentEntry) {
            const { sadScore, happyScore, neutralScore } = recentEntry;
    
            if (
                sadScore > happyScore && sadScore > neutralScore && 
                happyScore === prevHappyScore && neutralScore === prevNeutralScore
            ) {
                await sendEmergencyEmail(userEmail);
                console.log("Emergency email sent! 🚨");
            }
    
            moodHistory.splice(0, 1);
        }
    };
    
    setInterval(checkMoodEvery2Minutes, 120000); 

    const translateText = async (text: string, targetLanguage: string): Promise<string> => {
        try {
            const result = await translate(text, { to: targetLanguage });
            return result.text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    const detectLanguage = async (text: string): Promise<string> => {
        try {
            const result = await translate(text, { to: 'en' });
            return result.from.language.iso;
        } catch (error) {
            console.error('Language detection error:', error);
            return 'en';
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
    
        const detectedLanguage = await detectLanguage(inputText);
        let translatedText = inputText;
    
        if (detectedLanguage !== 'en') {
            translatedText = await translateText(inputText, 'en');
        }
    
        const newMessages: Message[] = [...messages, { text: inputText, sender: 'user' }];
        setMessages(newMessages);
        saveChatHistory(newMessages);
        setInputText('');
    
        // Detect emotion using the improved sentiment analysis
        const detectedEmotion = analyzeSentiment(translatedText);
    
        // Update emotion counts
        setEmotionCounts((prevCounts) => ({
            ...prevCounts,
            [detectedEmotion as keyof typeof emotionCounts]: prevCounts[detectedEmotion as keyof typeof emotionCounts] + 1 as number,
        }));
    
        let aiResponse = await getAIResponse(translatedText);
    
        if (detectedLanguage !== 'en') {
            aiResponse = await translateText(aiResponse, detectedLanguage);
        }
    
        // Text-to-Speech for AI response
        Speech.speak(aiResponse, {
            language: detectedLanguage, // Speak in the detected language
            pitch: 1.0, // Adjust pitch if needed
            rate: 1.0, // Adjust speed if needed
        });
    
        const updatedMessages: Message[] = [...newMessages, { text: aiResponse, sender: 'bot' }];
        setMessages(updatedMessages);
        saveChatHistory(updatedMessages);
    };

    const sendEmergencyMessage = () => {
        Alert.alert('Emergency Alert', `Message sent to ${EMERGENCY_CONTACT}`);
    };

    const clearChatHistory = async () => {
        try {
            await AsyncStorage.removeItem('chatHistory');
            setMessages([]);
            // Reset emotion counts to initial values
            setEmotionCounts({
                happiness: 0,
                sadness: 0,
                neutral: 0,
                anger: 0,
                disgust: 0,
                fear: 0,
                surprise: 0,
            });
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    };

    const onSpeechResults = (event: any) => {
        const text = event.value[0];
        setInputText(text);
    };
    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "You need to allow camera access.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: false, // Ensure the image is not base64 encoded
        });

        if (!result.canceled) {
            // Pass the captured image URI to the mood analysis function
            analyzeMoodFromImage(result.assets[0].uri);
        }
    };
    
    const analyzeMoodFromImage = async (imageUri: string): Promise<void> => {
        try {
            console.log("Fetching image from URI:", imageUri);

            // Resize the image using expo-image-manipulator
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 800 } }], // Resize the image to a width of 800px
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
            );

            console.log("Resized Image URI:", manipulatedImage.uri);

            // Convert the resized image URI to a Blob
            const response = await fetch(manipulatedImage.uri);
            const blob = await response.blob();

            // Convert Blob to Base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Image = reader.result?.toString().split(",")[1]; // Extract Base64 string

                if (!base64Image) {
                    console.error("Failed to convert image to Base64.");
                    Alert.alert("Error", "Could not process the image. Please try again.");
                    return;
                }

                console.log("Base64 Image Length:", base64Image.length);

                // Create FormData
                const formData = new FormData();
                formData.append("image_base64", base64Image); // Use Base64 instead of Blob
                formData.append("api_key", "SLuFi3OFeUTOZ4eLCSBSIIT4alSeLgW_");
                formData.append("api_secret", "MCdpy-9vjufWT8RRRK2fcMDF-7ztclZ5");
                formData.append("return_attributes", "emotion");

                console.log("Sending request to Face++ API...");

                // Make API request
                const apiResponse = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
                    method: "POST",
                    body: formData,
                });

                const data = await apiResponse.json();
                console.log("API Response:", JSON.stringify(data, null, 2));

                if (!data.faces || data.faces.length === 0) {
                    Alert.alert("No Face Detected", "Make sure the image contains a clear face.");
                    return;
                }

                const emotions = data.faces[0].attributes.emotion;
                const detectedEmotion = Object.keys(emotions).reduce((a, b) =>
                    emotions[a] > emotions[b] ? a : b
                );

                console.log("Detected Emotion:", detectedEmotion);

                // Update emotion counts
                setEmotionCounts((prevCounts) => ({
                    ...prevCounts,
                    [detectedEmotion as keyof typeof prevCounts]: prevCounts[detectedEmotion as keyof typeof prevCounts] + 1,
                }));

                // Generate a prompt based on the detected emotion
                let prompt = "";
                if (detectedEmotion === "happiness") {
                    prompt = "You seem happy! What's making your day great? 😊";
                } else if (detectedEmotion === "sadness") {
                    prompt = "You seem a bit down. Want to talk about it? 💙";
                } else if (detectedEmotion === "neutral") {
                    prompt = "You seem neutral. What's on your mind? 🤔";
                } else if (detectedEmotion === "anger") {
                    prompt = "You seem upset. Want to vent about it? 😡";
                } else if (detectedEmotion === "disgust") {
                    prompt = "Something seems to bother you. Want to share? 🤢";
                } else if (detectedEmotion === "fear") {
                    prompt = "You seem worried. Is there something troubling you? 😨";
                } else if (detectedEmotion === "surprise") {
                    prompt = "You seem surprised! What's caught your attention? 😲";
                } else {
                    prompt = "How are you feeling today? Let's chat! 🌟";
                }

                // Send the prompt to the chatbot
                const newMessages: Message[] = [
                    ...messages,
                    { text: prompt, sender: "bot" },
                ];
                setMessages(newMessages);
                saveChatHistory(newMessages);

                // Get chatbot response based on the prompt
                const chatbotResponse = await getAIResponse(prompt);

                // Add chatbot response to the chat
                const updatedMessages: Message[] = [
                    ...newMessages,
                    { text: chatbotResponse, sender: "bot" },
                ];
                setMessages(updatedMessages);
                saveChatHistory(updatedMessages);

                // Optionally, use Text-to-Speech to read the chatbot's response aloud
                Speech.speak(chatbotResponse, {
                    language: "en",
                    pitch: 1.0,
                    rate: 1.0,
                });

                Alert.alert("Mood Detected", `You're feeling: ${detectedEmotion}`);
            };

            reader.onerror = () => {
                console.error("Error reading the Blob as Base64.");
                Alert.alert("Error", "Could not process the image. Please try again.");
            };
        } catch (error) {
            console.error("Mood Analysis Error:", error);
            Alert.alert("Error", "Could not analyze mood. Please try again later.");
        }
    };

    const getSentimentPercentages = () => {
        const userMessages = messages.filter(msg => msg.sender === 'user');

        if (userMessages.length === 0) return { happy: 0, neutral: 0, sad: 0 };

        let sentimentCounts = { happy: 0, neutral: 0, sad: 0 };

        userMessages.forEach(msg => {
            const score = analyzeSentiment(msg.text);
            if (Number(score) > 0.5) sentimentCounts.happy++;
            else if (Number(score) < -0.5) sentimentCounts.sad++;
            else sentimentCounts.neutral++;
        });

        const total = userMessages.length;
        return {
            happy: (sentimentCounts.happy / total) * 100,
            neutral: (sentimentCounts.neutral / total) * 100,
            sad: (sentimentCounts.sad / total) * 100,
        };
    };

    const getEmotionPercentages = () => {
        const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
        if (total === 0) return {};

        return Object.entries(emotionCounts).reduce((percentages, [emotion, count]) => {
            percentages[emotion] = ((count / total) * 100).toFixed(2);
            return percentages;
        }, {} as Record<string, string>);
    };

    setInterval(checkMoodEvery2Minutes, 120000);
    const renderMessageItem = ({ item }: { item: Message }) => {
        if (item.text.includes("youtube.com")) {
            const urlMatch = item.text.match(/(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);

            if (urlMatch && urlMatch[3]) {
                const videoId = urlMatch[3]; 
            return (
                <View style={styles.messageContainer}>
                    <WebView
                        style={{ width: 250, height: 140 }}
                        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
                    />
                </View>
            );
        }
        }
        return (
            <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.sentimentContainer}>
                {Object.entries(getEmotionPercentages()).map(([emotion, percentage]) => (
                    <View key={emotion} style={styles.sentimentItem}>
                        <Text style={styles.sentimentEmoji}>
                            {emotion === "happiness"
                                ? "😊"
                                : emotion === "sadness"
                                ? "😢"
                                : emotion === "neutral"
                                ? "😐"
                                : emotion === "anger"
                                ? "😡"
                                : emotion === "disgust"
                                ? "🤢"
                                : emotion === "fear"
                                ? "😨"
                                : "😲"}
                        </Text>
                        <Text style={styles.sentimentText}>{percentage}%</Text>
                    </View>
                ))}
            </View>

            <FlatList
                ref={flatListRef}
                data={[...messages].reverse()}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderMessageItem}
                inverted
            />

            <TouchableOpacity style={styles.clearChatButton} onPress={clearChatHistory}>
                <Text style={styles.clearChatText}>🗑️</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#aaa"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>➣</Text>
                </TouchableOpacity>
             
                <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
    <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" />
</TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 15, 
        backgroundColor: '#171923' // Updated to match the dark theme
    },
    sentimentContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginVertical: 10 
    },
    sentimentItem: { 
        alignItems: 'center' 
    },
    sentimentEmoji: { 
        fontSize: 30 
    },
    sentimentText: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#E2E8F0' // Updated text color for better contrast
    },
    messageContainer: { 
        padding: 12, 
        borderRadius: 15, 
        marginVertical: 5, 
        maxWidth: '75%' 
    },
    userMessage: { 
        alignSelf: 'flex-end', 
        backgroundColor: '#4CAF50', 
        borderBottomRightRadius: 3, 
        color: "#000" 
    },
    botMessage: { 
        alignSelf: 'flex-start', 
        backgroundColor: '#4A5568', 
        borderBottomLeftRadius: 3, 
        color: "#E2E8F0" 
    },
    messageText: { 
        fontSize: 16, 
        color: '#E2E8F0' // Updated text color for better contrast
    },
    inputContainer: { 
        flexDirection: 'row', 
        padding: 10, 
        backgroundColor: '#2D3748', // Updated to match the dark theme
        borderTopWidth: 1, 
        borderRadius: 10, 
        borderColor: '#4A5568' // Border color for better contrast
    },
    input: { 
        flex: 1, 
        padding: 12, 
        borderWidth: 1, 
        borderColor: '#4A5568', 
        borderRadius: 25, 
        fontSize: 16, 
        backgroundColor: '#2D3748', // Updated to match the dark theme
        color: '#E2E8F0' // Updated text color for better contrast
    },
    sendButton: { 
        backgroundColor: '#7F5AF0', 
        padding: 12, 
        borderRadius: 25, 
        marginLeft: 10 
    },
    sendButtonText: { 
        fontSize: 26, 
        color: '#fff' 
    },
    clearChatButton: { 
        backgroundColor: '#FF3B30', 
        padding: 10, 
        borderRadius: 5, 
        alignSelf: 'center', 
        marginVertical: 10, 
        marginLeft: 300 
    },
    clearChatText: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
    cameraButton: {
        backgroundColor: '#7F5AF0', // Matches the theme
        padding: 12,
        borderRadius: 25,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default ChatScreen;