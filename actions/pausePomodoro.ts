import axios from 'axios';

export default async () => {
  const color = {color: "green"}

  axios.post(`${process.env.ZAPIER_URL}`, {
    color: color
  })
}
