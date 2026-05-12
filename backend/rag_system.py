from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader
)

from langchain_text_splitters import CharacterTextSplitter

from langchain_community.vectorstores import FAISS

from langchain_community.embeddings import HuggingFaceEmbeddings

import os

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = None


def build_vectorstore():

    global vectorstore

    docs = []

    folder_path = "documents"

    for file in os.listdir(folder_path):

        file_path = os.path.join(folder_path, file)

        if file.endswith(".txt"):

            loader = TextLoader(file_path)

        elif file.endswith(".pdf"):

            loader = PyPDFLoader(file_path)

        else:
            continue

        docs.extend(loader.load())

    splitter = CharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=50
    )

    split_docs = splitter.split_documents(docs)

    vectorstore = FAISS.from_documents(
        split_docs,
        embeddings
    )


def retrieve_context(query):

    global vectorstore

    if vectorstore is None:
        build_vectorstore()

    results = vectorstore.similarity_search(query, k=2)

    context = "\n".join(
        [doc.page_content for doc in results]
    )

    return context