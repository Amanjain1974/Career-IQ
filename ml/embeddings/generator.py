from typing import List, Union
import numpy as np
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

class EmbeddingGenerator:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initializes the sentence transformer model for generating semantic embeddings.
        """
        if SentenceTransformer:
            self.model = SentenceTransformer(model_name)
        else:
            self.model = None

    def generate_embedding(self, text: Union[str, List[str]]) -> np.ndarray:
        """
        Generates an embedding vector for a given text or list of texts.
        """
        if not self.model:
            # Fallback for when library is not installed
            print("Warning: SentenceTransformer not loaded. Returning random embeddings.")
            if isinstance(text, str):
                return np.random.rand(384)
            return np.random.rand(len(text), 384)
            
        return self.model.encode(text)

    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculates cosine similarity between two embeddings.
        """
        from sklearn.metrics.pairwise import cosine_similarity
        
        # Reshape if they are 1D arrays
        if embedding1.ndim == 1:
            embedding1 = embedding1.reshape(1, -1)
        if embedding2.ndim == 1:
            embedding2 = embedding2.reshape(1, -1)
            
        similarity = cosine_similarity(embedding1, embedding2)
        return float(similarity[0][0])
