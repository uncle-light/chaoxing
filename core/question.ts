import axios from 'axios';
import qs from 'qs';

type AnswerInfo = {
    refer: string;
    id: string;
    info: string;
}

export default class Question {

    private static url = 'https://cx.icodef.com/v2/answer?platform=cx';
    private static axios = axios
    static getQuestion(question: string, answer: string) {
    }
    static async getAnswer(info: AnswerInfo, topic: string[], type: number[]) {
        const {data} =await this.axios.post(this.url, qs.stringify({info, type, topic}))
        return data
    }

}