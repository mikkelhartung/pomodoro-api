import axios from 'axios';

export default async () => {
  const color = {color: "red"}

  axios.post(`${process.env.ZAPIER_URL}`, {
    color: color
  })
}
