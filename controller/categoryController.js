const Category = require("../models/Category");

const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple category
const addAllCategory = async (req, res) => {
  // console.log("category", req.body);
  try {
    await Category.deleteMany();

    await Category.insertMany(req.body);

    res.status(200).send({
      success:true,
      message: "Category Added Successfully!",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).send({
      success:false,
      message: err.message,
    });
  }
};

// get status show category
const getShowingCategory = async (req, res) => {
  try {
    const categories = await Category.find({ status: "show" }).sort({
      _id: -1,
    });

    const categoryList = readyToParentAndChildrenCategory(categories);
    // console.log("category list", categoryList.length);
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all category parent and child
const getAllCategory = async (req, res) => {
  try {
      const data=req.query;
      var limit = data.limit ? Number(data.limit) : 2;
      var page = data.page ? Number(data.page) : 1;
      
    const allParentCategories = await Category.find({parentId:null}).skip((page - 1) * limit).limit(limit).exec();
    const allcategories = await Category.find({}).exec();
    const categories = readyToParentAndChildrenCategory(allcategories);

    var count=allParentCategories.length;
    var totallength=Math.ceil(count/limit);
      if(totallength==1 && page==totallength ){
        prevPage=null;
        hasPrevPage=false;
        nextPage=null;
        hasNextPage=false; 
    }
    else if(page==1 && totallength>page) {
                prevPage=null;
                hasPrevPage=false;
                nextPage=Number(page)+1; 
                hasNextPage=true;
    }
    else if(page>1 && page==totallength){
            prevPage=Number(page)-1;
            hasPrevPage=true;
            nextPage=null;
            hasNextPage=false;
    }
    else{   prevPage=Number(page)-1;
            nextPage=Number(page)+1;
            hasPrevPage=true;
            hasNextPage=true;
    }

  const  Pagination ={
    "TotalDocuments":count,
    "limit":limit,
    "TotalPages":totallength,
    "Current Page":page,
    "PrevPage":prevPage,
    "NextPage":nextPage,
    "HasPrevPage":hasPrevPage,
    "HasNextPage":hasNextPage,
    "PagingCounter":page,      
  };
    res.send({
      success:true,
      message: "Successfully fetch!!",
      categories,
      Pagination
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      // category.name = req.body.name;
      // category.description = req.body.description;
    
      // category.icon = req.body.icon;
      // category.status = req.body.status;
      // category.parentId = req.body.parentId
      //   ? req.body.parentId
      //   : category.parentId;
      // category.parentName = req.body.parentName;
      category.name = req.body.name ? req.body.name : category.name;
      category.description = req.body.description ? req.body.description : category.description;
      category.icon = req.body.icon ? req.body.icon : category.icon;
      category.status = req.body.status ? req.body.status : category.status;
      category.parentId = req.body.parentId ? req.body.parentId : category.parentId;
      category.parentName = req.body.parentName ? req.body.parentName : category.parentName;


      await Category.updateOne({ _id: req.params.id }, { $set: { ...category } });

      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many category
const updateManyCategory = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Category.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Categories update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// category update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Category ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single category delete
const deleteCategory = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children category
  // Category.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Category Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple category delete
const deleteManyCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });

    await Category.deleteMany({ parentId: req.body.ids });
    await Category.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenCategory = (categories, parentId = null) => {
  const categoryList = [];
  let Categories;
  if (parentId == null) {
    Categories = categories.filter((cat) => cat.parentId == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of Categories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate._id),
    });
  }
  return categoryList;
};

module.exports = {
  addCategory,
  addAllCategory,
  getAllCategory,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  getAllCategories,
  updateManyCategory,
};
