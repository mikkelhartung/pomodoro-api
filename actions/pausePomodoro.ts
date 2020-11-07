import axios from 'axios';

type LuxaforType = {
  userId: string
  color?: string
}

export default async (data: LuxaforType) => {
  const {userId, color = "green"} = data

  axios.post('https://api.luxafor.com/webhook/v1/actions/solid_color', {
    userId: userId,
    "actionFields": {
      color: color
    }
  }).then((data) => console.log(data.data))
}
