import { toast } from "react-hot-toast";
import apiClient from "../../api/api";
const FavouriteButton = ({ movieId }) => {
  return (
    <button
      onClick={async () => {
        toast.promise(apiClient.post("/favorites/add", { movie_id: movieId }), {
          pending: "Adding to favorites...",
          success: "Added to favorites!",
          error: "Error adding to favorites!",
        });
      }}
      style={{
        backgroundColor: "#007bff",
        marginLeft: "10px",
      }}
    >
      Favourite
    </button>
  );
};

export default FavouriteButton;
