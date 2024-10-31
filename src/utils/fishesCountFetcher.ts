import { useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import { useFishesCountStore } from "../store/fishesCountStore";

const FishesCountFetcher: React.FC = () => {
  const { user } = useAuthStore();
  const { setFishesCount } = useFishesCountStore();

  const fetchFishesCount = useCallback(async () => {
    if (user) {
      try {
        const fishesCountDocRef = doc(
          db,
          "users",
          user.uid,
          "fishesCount",
          "fishesCount"
        );
        const fishesCountDoc = await getDoc(fishesCountDocRef);

        if (fishesCountDoc.exists()) {
          const fishesCountData = fishesCountDoc.data();
          const fishesCount = fishesCountData?.FishesCount;
          if (fishesCount !== undefined) {
            setFishesCount(fishesCount);
          } else {
            console.error("FishesCount field is missing in the document");
            await setDoc(
              fishesCountDocRef,
              { FishesCount: 0 },
              { merge: true }
            );
            setFishesCount(0);
          }
        } else {
          console.error("FishesCount document does not exist");
          await setDoc(fishesCountDocRef, { FishesCount: 0 });
          setFishesCount(0);
        }
      } catch (error) {
        console.error("Error fetching user fishes count", error);
      }
    }
  }, [user, setFishesCount]);

  useEffect(() => {
    fetchFishesCount();
  }, [fetchFishesCount]);

  return null;
};

export default FishesCountFetcher;
