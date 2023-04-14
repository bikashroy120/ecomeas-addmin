import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { delImg } from "../features/upload/uploadSlice";
import { createProducts, getProduct, resetState, updateProducts } from "../features/product/productSlice";
import PhotosUploader from "../components/PhotosUploader";


const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams()
  const {id} = params;
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  console.log(color);
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getProduct(id))
  }, []);


  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, updateProduct,product } = newProduct;

  const [title,setTitle]= useState("")
  const [description,setdescription] = useState("")
  const [price,setprice] = useState("")
  const [brand,setbrand] = useState("")
  const [category,setcategory] = useState("")
  const [tags,settags]=useState("")
  const [quantity,setquantity]=useState("")

  console.log(product.images)

  useEffect(() => {
    if (isSuccess && updateProduct) {
      toast.success("Product Update Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  // const coloropt = [];
  // colorState.forEach((i) => {
  //   coloropt.push({
  //     label: i.title,
  //     value: i._id,
  //   });
  // });
  // const img = [];
  // imgState.forEach((i) => {
  //   img.push({
  //     public_id: i.public_id,
  //     url: i.url,
  //   });
  // });


useEffect(()=>{
    setTitle(product?.title);
    setdescription(product?.description);
    setprice(product?.price);
    setcategory(product?.category?._id);
    settags(product?.tags);
    setImages(product.images || [])
    // setImages(product?.images);
    setbrand(product?.brand?._id)
    setquantity(product?.quantity)
},[product])


  const submitFrom = (e)=>{
    e.preventDefault();
    const productData={
      id:id,
      product:{
        title,description,price,brand,category,tags,quantity,images
      }
    }

    console.log(productData)
    dispatch(updateProducts(productData))
    setTimeout(() => {
      dispatch(resetState());
    }, 3000);
  }


  const handleColors = (e) => {
    setColor(e);
    console.log(color);
  };
  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        <form
          onSubmit={submitFrom}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={(e)=>setTitle(e.target.value)}
            val={title}
          />
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={setdescription}
              value={description}
            />
          </div>
          <div className="error">
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={(e)=>setprice(e.target.value)}
            val={price}
          />
          <select
            name="brand"
            onChange={(e)=>setbrand(e.target.value)}
            value={brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (      
                <option key={j} value={i._id}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
          </div>
          <select
            name="category"
            onChange={(e)=>setcategory(e.target.value)}
            value={category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i._id}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <select
            name="tags"
            onChange={(e)=>settags(e.target.value)}
            value={tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>

          {/* <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          /> */}
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={(e)=>setquantity(e.target.value)}
            val={quantity}
          />
          {/* <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div> */}

          <div className="w-full">
            <PhotosUploader addedPhotos={images} onChange={setImages}/>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {imgState?.map((i, j) => {
              return (
                <div className=" position-relative" key={j}>
                  <button
                    type="button"
                    onClick={() => dispatch(delImg(i.public_id))}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={i.url} alt="" width={200} height={200} />
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
