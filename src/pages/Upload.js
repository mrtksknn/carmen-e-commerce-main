import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {ref} from "firebase/storage";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { addDoc, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
// Images
import background from '../assets/images/background.png';
// Css
import '../assets/styles/upload.css';
import Cards from '../components/cards/cards';

const initialState = {
  name: "",
  width: "",
  height: "",
  price: "",
  material: "",
  category: "",
  collections: "",
  description: ""
}

const Upload = () => {

  const [data, setData] = useState(initialState);
  const { name, width, height, price, material, category, collections, description } = data;
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isSubmit, setIsSubmit] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        list.sort((a, b) => {
          return b.timeStamp?.seconds - a.timeStamp?.seconds;
        });

        setProducts(list);
        setLoading(false);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsub();
    }

  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setProgress(progress);
        switch (snapShot.state) {
          case "paused":
            console.log("upload is Pause");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      }, (error) => {
        console.error(error);
      },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setData((prev) => ({ ...prev, img: downloadUrl }))
          });
        }
      );
    }

    if (file) {
      uploadFile();
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleRemove = () => {
    setFile(null);
    setFilePreview(null);
    setProgress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      await addDoc(collection(db, "products"), {
        ...data,
        timeStamp: serverTimestamp()
      });
      // Reset the form fields
      setData(initialState);
      setFile(null);
      setFilePreview(null);
      setProgress(null);
      setIsSubmit(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const uploadHeader = {
    width: "100%",
    height: '280px',
    marginBottom: "48px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundImage: `url(${background})`,
    display: "flex",
    fontSize: "28px",
    alignItems: "center",
    justifyContent: "center"
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  return (
    <div>
      <div style={uploadHeader}>
        Sanatını Yükle
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          paddingBottom: "24px",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            gap: "40px",
            display: "flex",
            width: "100%",
            maxWidth: "1335px",
            flexDirection: "column"
          }}
        >

          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "620px",
                borderRadius: "10px",
                border: "2px dashed #5f5f5f42",
                display: "flex",
                gap: "12px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {filePreview ?
               <div style={{ position: "sticky" }}>
                <img src={filePreview} alt="Preview" style={{ width: '315px', maxHeight: '440px' }} />

                <button
                    type="button"
                    onClick={handleRemove}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#959595",
                      color: "#000",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <span className="material-icons delete">delete</span>
                  </button>
               </div>
                : 
                <label
                  htmlFor="file-upload"
                  className="custom-file-upload"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <span>
                    Click to Upload
                  </span>
                  <span>
                    or
                  </span>
                  <span>
                    Dropdown your File
                  </span>

                  <span className="material-icons"
                    style={{
                      fontSize: "32px",
                      marginTop: "24px",
                      border: "1px solid #fff",
                      borderRadius: "50%"
                    }}
                  >add</span>
                </label>
              }
            </div>
            <input
              type="file"
              label="upload"
              style={{
                width: "100%",
                border: "1px solid #fff",
                borderRadius: "5px",
                display: "none"
              }}
              id="file-upload"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div
              style={{
                gap: "24px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <input
                style={{
                  padding: "18px 20px",
                  color: '#777E90',
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#393939"
                }}
                label="name"
                type="text"
                placeholder="Ürün Adı Giriniz"
                name="name"
                onChange={handleChange}
                value={name}
                autoFocus
              ></input>

              <div
                style={{
                  gap: "24px",
                  display: "flex"
                }}
              >
                <input
                  style={{
                    padding: "18px 20px",
                    color: '#777E90',
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#393939"
                  }}
                  label="Genişlik (cm)"
                  type="text"
                  placeholder="Genişlik (cm)"
                  name="width"
                  onChange={handleChange}
                  value={width}
                  autoFocus
                ></input>

                <input
                  style={{
                    padding: "18px 20px",
                    color: '#777E90',
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#393939"
                  }}
                  label="Boyu (cm)"
                  type="text"
                  placeholder="Boyu (cm)"
                  name="height"
                  onChange={handleChange}
                  value={height}
                  autoFocus
                ></input>
              </div>

              <div
                style={{
                  gap: "24px",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <input
                  style={{
                    padding: "18px 20px",
                    color: '#777E90',
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#393939"
                  }}
                  label="Fiyat (TL)"
                  type="number"
                  placeholder="Fiyat (TL)"
                  name="price"
                  onChange={handleChange}
                  value={price}
                  autoFocus
                ></input>

                <select
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    color: "#777E90",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#393939"
                  }}
                  name="category"
                  onChange={handleChange}
                  value={category}
                  autoFocus
                >
                  <option value="">Kategori Seçiniz</option>
                  <option value="orijinal">Orijinal</option>
                  <option value="baskı">Baskı</option>
                  <option value="koleksiyon">Koleksiyon</option>
                </select>
              </div>

              <select
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  color: "#777E90",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#393939"
                }}
                name="collections"
                onChange={handleChange}
                value={collections}
                autoFocus
              >
                <option value="">Koleksiyon Seçiniz</option>
                <option value="Kirmizi">Kırmızı Seri</option>
                <option value="Siyah">Siyah Seri</option>
              </select>

              <input
                style={{
                  padding: "18px 20px",
                  color: '#777E90',
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#393939"
                }}
                type="text"
                label="Kullanılan Materyal"
                placeholder="Kullanılan Materyal"
                name="material"
                onChange={handleChange}
                value={material}
                autoFocus
              ></input>

              <textarea
                style={{
                  padding: "18px 20px",
                  color: '#777E90',
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#393939"
                }}
                type="text"
                label="Açıklama"
                placeholder="Açıklama"
                name="description"
                onChange={handleChange}
                value={description}
                autoFocus
              ></textarea>

              <button
                type="submit"
                style={{
                  width: "100%",
                  color: !progress && '#817b7b',
                  background: !progress && '#2d0a0a'
                }}
                disabled={progress < 100 && isSubmit}
              >
                Submit
              </button>
            </div>
          </form>

          <div
            style={{
              gap: "24px",
              display:"flex",
              flexWrap: "wrap"
            }}
          >
            {(!loading && products) ?
              products.map((item) => (
                <Cards
                  id={item.id}
                  key={item.name}
                  image={item.img}
                  name={item.name}
                  price={item.price}
                  category={item.kategori}
                  changeable={true}
                />
              ))
              : 
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <ClipLoader color="#dd5331" loading={loading} css={override} size={150} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
