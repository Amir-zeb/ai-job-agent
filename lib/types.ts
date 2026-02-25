export type JobT = {
    _id: string,
    title: string,
    company: string,
    location: string,
    salary: string,
    salaryMin: string,
    salaryMax: string,
    url: string,
    postDate: Date,
    description: string,
    source: string,
    aiScore: number,
    isRelevant: boolean,
    aiReason: string,
    aiRated: string,
    createdAt: Date,
}

export type AiUsageT = {
    _id: string,
    count: number,
    date: string,
}
