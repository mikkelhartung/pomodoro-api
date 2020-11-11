import axios from 'axios';

export default async () => {
  const color = {color: "white"}

  axios.post(`${process.env.ZAPIER_URL}`, {
    color: color
  })
}
