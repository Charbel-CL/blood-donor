import { useState } from "react";

function usePost() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (url, postData) => {
    setLoading(true);
    setError(null);
    setData(null); 
    try {
      const response = await fetch(`http://localhost:5212${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email already exists");
        } else if (response.status === 401) {
          throw new Error("Invalid email or password");
        } else {
          throw new Error(result.message || "Something went wrong");
        }
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
}

export default usePost;
