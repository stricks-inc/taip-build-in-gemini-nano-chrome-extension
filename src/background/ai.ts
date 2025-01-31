
export const isLocalAiAvailable = () => {
    return self && 'ai' in self
}

export const isLanguageModelAvailable = () => {
    return isLocalAiAvailable() && 'languageModel' in self.ai
}

export const isSummarizerAvailable = () => {
    return isLocalAiAvailable() && 'summarizer' in self.ai
}

export const isModelAvailable = () => {
    return isLocalAiAvailable() && (isLanguageModelAvailable() || isSummarizerAvailable())
}

export const getLanguageModelStatus = async () => {
    if (!isLanguageModelAvailable()) {
        return null;
    }
    const available = (await self.ai.languageModel.capabilities()).available;
    return available;
}

export const getSummarizerStatus = async () => {
    if (!isSummarizerAvailable()) {
        return null;
    }
    const available = (await self.ai.summarizer.capabilities()).available;
    return available;
}

export const getCapabilities = async () => {
    initAllModels();
    return Promise.all([
        getLanguageModelStatus(),
        getSummarizerStatus()
    ]).then(([languageModel, summarizer]) => ({
        languageModel,
        summarizer
    }));
}

let languageModel: AILanguageModel | null = null;
let summarizer: AISummarizer | null = null;

const initLanguageModel = async () => {
    if (!isLanguageModelAvailable()) {
        return null;
    }

    if (languageModel) {
        return languageModel;
    }
    const capabilities = await self.ai.languageModel.capabilities();
    languageModel = await self.ai.languageModel.create({
        temperature: 0.8,
        topK: capabilities.defaultTopK || 3,
        systemPrompt: "You are a helpful assistant which helps the user to rephrase, translate, reply, summarize, etc.",
    });
    console.log("Language model initialized", languageModel);
    return languageModel;
}


const initSummarizer = async () => {
    if (!isSummarizerAvailable()) {
        return null;
    }
    summarizer = await self.ai.summarizer.create({
        format: "plain-text",
        length: "medium",
        type: "tl;dr",
    });
    console.log("Summarizer initialized", summarizer);
    return summarizer;
}

export const initAllModels = async () => {
    await Promise.all([
        initLanguageModel(),
        initSummarizer()
    ]);
}

export const getLanguageModel = () => {
    if (!languageModel) {
        initLanguageModel()
        .then(() => {
            return languageModel;
        });
    }
    return languageModel;
}

export const getSummarizer = () => {
    if (!summarizer) {
        initSummarizer().then(() => {
            return summarizer;
        });
    }
    return summarizer;
}