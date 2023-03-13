import moment from 'moment';
import { MessageDTO } from 'src/dto/message.dto';
export const generateMessage = (user: string, obj: MessageDTO) => {
    return {
        user,
        obj,
        createdAt: moment(new Date().getTime()).format("YYYY-MM-DD HH:mm")
    }
}