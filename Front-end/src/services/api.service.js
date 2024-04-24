import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/son",
        Accept: "application/json",
    },
};

export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};