<template>
    <div class="form-input">
        <Form
        @submit="addProduct"
        enctype="multipart/form-data"
    >
        <div class="input-section">
            <strong>Tên: </strong>
            <Field
            name="name"
            type= "text"
            class="form-control"
            v-model="productLocal.name"
            placeholder="Nhập tên sách"
            />
            <ErrorMessage name="name" class="error-feedback"/>
        </div>
        <!-- <div class="input-section">
            <Field
            name="type"
            type= "text"
            class="form-control"
            v-model="productLocal.type"
            placeholder="Nhap loai san pham"
            />
            <ErrorMessage name="type" class="error-feedback"/>
        </div> -->
        <!--Chọn type cho sản phẩm-->
        <div class="input-section">
            <strong>Giá: </strong>
            <Field
            name="price"
            type= "number"
            class="form-control"
            v-model="productLocal.price"
            placeholder="Nhập giá sách"
            />
            <ErrorMessage name="price" class="error-feedback"/>
        </div>
        <div class="input-section">
            <strong>Hình ảnh: </strong>
            <Field
            name="img"
            type= "file"
            v-model="productLocal.img"
            class="form-control"
            placeholder="Chọn ảnh sách"
            @change="onChange"
            />
            <ErrorMessage name="image" class="error-feedback"/>
        </div>
        <img :src="this.productLocal.img" alt="" style="width: 20%;">
        <div class="input-section textarea">
            <strong>Mô tả: </strong>
            <textarea
                name="describe"
                type= "text-area"
                class="form-control text-area"
                v-model="productLocal.describe"
                placeholder="Mô tả sản phẩm">
            </textarea>
            <ErrorMessage name="describe" class="error-feedback"/>
        </div>
        <div class="input-section">
            <strong>Tác giả: </strong>
            <Field
            name="author"
            type= "text"
            class="form-control"
            v-model="productLocal.author"
            placeholder="Tên tác giả"
            />
            <ErrorMessage name="type" class="error-feedback"/>
        </div>
        <div class="form-group">
        <button class="btn btn-primary" >Lưu</button>
    </div>
    </Form>
    </div>
</template>

<script>
    import bookstoreService from '../services/bookstore.service';
    import {Form, Field, ErrorMessage} from "vee-validate";
    import Swal from 'sweetalert2';

    export default{
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        props: {
            products: {type: Object, required: true},
        },
        data() {
            return {
            productLocal: this.products,
            files:null ,
            };
        },
        emits: ["submit:products"],
        methods: {
            addProduct() {
                this.$emit("submit:products", this.productLocal);
            },
            onChange(event) {
                const files = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.productLocal.img = event.target.result;
                };
                reader.readAsDataURL(files);

            },
        },
    }
</script>
<style scoped>
    .input-section{
        display: flex;
        flex-direction: row;
        height: 35px;
        width: 350px;
        margin-bottom: 5px;
        max-height: 300px;
    }

    .input-section strong{
        margin-right: 5px;
        width: 100px;
    }

    .text-area{
        height: 100px;
        overflow-y: auto;
        resize: vertical;
    }
    .textarea{
        height: 100px;
    }
    .form-control{
        max-height: 300px;
    }


</style>
