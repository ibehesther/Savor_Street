import moment from 'moment-timezone';
import { MessageDTO } from 'src/dto/message.dto';



export const generateMessage = (user: string, obj: MessageDTO) => {
    const timezone = (moment.tz.guess(true))
    return {
        user,
        obj,
        createdAt: moment(new Date().toISOString()).tz(timezone).format("HH:mm")
    }
}