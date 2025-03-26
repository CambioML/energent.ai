interface RecordingAPI {
    startRecording: (conversationId: string, messageId: string) => Promise<any>;
    stopRecording: () => Promise<any>;
    getRecordings: () => Promise<any>;
}