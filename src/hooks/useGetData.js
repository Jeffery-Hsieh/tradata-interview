import { useEffect, useState } from "react";
import mockData from "./data.json";

const useGetData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      setData(mockData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { data, isLoading };
};

export default useGetData;
