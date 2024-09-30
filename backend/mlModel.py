from deepface import DeepFace
import sys
import os
import json

# Suppress TensorFlow GPU logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # Disable GPU and force TensorFlow to use CPU

def classify_gender(image_path, expected_gender):
    try:
        # Analyze the image to detect gender
        analysis = DeepFace.analyze(img_path=image_path, actions=['gender'])

        # Access the first result in the list
        gender_data = analysis[0]

        # Print the entire analysis result for debugging
        print(f"Full analysis result: {gender_data}")

        # Access the dominant gender
        predicted_gender = gender_data['dominant_gender']

        # Normalize the predicted gender: 'Man' -> 'male', 'Woman' -> 'female'
        gender_map = {
            'Man': 'male',
            'Woman': 'female'
        }
        normalized_gender = gender_map.get(predicted_gender, '').lower()

        # Compare normalized predicted gender with the expected gender
        result = normalized_gender == expected_gender.lower()

        # Output the result to Node.js (just 'True' or 'False')
        print("True" if result else "False")

    except Exception as e:
        print(f"Error processing the image: {str(e)}")
        print("False")

if __name__ == "__main__":
    # Accept arguments from Node.js
    image_path = sys.argv[1]
    expected_gender = sys.argv[2]
    classify_gender(image_path, expected_gender)
