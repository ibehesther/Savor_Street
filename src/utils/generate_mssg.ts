import moment from 'moment';
import { MessageDTO } from 'src/dto/message.dto';

const date = new Date(Date.now());
let createdAt=date.toString().split(" ")[4];
createdAt = createdAt.split("").splice(0, 5).join('');

export const generateMessage = (user: string, obj: MessageDTO) => {
    return {
        user,
        obj,
        createdAt
    }
}