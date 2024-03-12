import axios from "axios";


export const storiesDataft = async () =>{
    try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/danh-sach/sap-ra-mat`
        );
        return res.data
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
}