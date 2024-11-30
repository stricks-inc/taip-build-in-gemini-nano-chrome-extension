
export const isLocalAiAvailable = () => {
    return self && 'ai' in self
}

export const isLanguageModelAvailable = () => {
    return isLocalAiAvailable() && 'languageModel' in self.ai
}

export const getLanguageModelStatus = async () => {
    if (!isLanguageModelAvailable()) {
        return null;
    }
    const available = (await self.ai.languageModel.capabilities()).available;
    return available;
}

let languageModel: AILanguageModel | null = null;

export const initLanguageModel = async () => {
    if (!isLanguageModelAvailable()) {
        return null;
    }

    if (languageModel) {
        return languageModel;
    }
    const capabilities = await self.ai.languageModel.capabilities();
    languageModel = await self.ai.languageModel.create({
        temperature: 0.8,
        topK: capabilities.defaultTopK || undefined,
        systemPrompt: "You are a helpful assistant which helps the user to rephrase, translate, reply, summarize, etc.",
    });
    languageModel.addEventListener("languageModelResponse", (data) => {
        console.log("languageModelResponse", data);
    });
    return languageModel;
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

