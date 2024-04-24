<template>
    <Form @submit="submitUser" :validation-schema="contactFormSchema">
        <h2 v-if="contactLocal._id">Chỉnh sửa thông tin</h2>
        <div v-if="contactLocal.avatar" class="rounded-circle avatar-output" @click="selectAvatar">
            <img :src="contactLocal.avatar" alt="" class="rounded-circle" >
            <i class="fa-solid fa-pen re-select-avatar-icon"></i>
        </div> 
        <div v-if="!contactLocal.avatar && contactLocal._id" class="avatar-input" @click="selectAvatar">
            <i class="fa-regular fa-image avatar-icon" ></i>
            
        </div>
        <input type="file" name="file" class="file" ref="fileInput" @change="onChange">
        <div class="input-section">
            <Field name="name" type="text" class="form-control" v-model="contactLocal.name" placeholder="Họ tên" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="input-section">
            <Field name="email" type="email" class="form-control" v-model="contactLocal.email" placeholder="Địa chỉ Email" />
            <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="input-section">
            <Field name="address" type="text" class="form-control" v-model="contactLocal.address"
                placeholder="Địa chỉ nhà" />
            <ErrorMessage name="address" class="error-feedback" />
        </div>

        <div class="input-section">
            <Field name="phone" type="phone" class="form-control" v-model="contactLocal.phone"
                placeholder="Số điện thoại" />
            <ErrorMessage name="phone" class="error-feedback" />
        </div>

        <div class="input-section">
            <div class="input-password">
                <Field name="password" type="password" class="form-control" id="passWords" v-model="contactLocal.password"
                placeholder="Mật khẩu" /> 
                <ErrorMessage name="password" class="error-feedback" />
            </div>
            
        </div>
        <div :class="{'show-password': contactLocal._id, 'show-password-signup': !contactLocal._id}">
                    <i class="fa-regular fa-eye" @click="showPassword" v-if="!showpass"></i>
                    <i class="fa-regular fa-eye-slash" @click="showPassword" v-if="showpass"></i>
                </div>
        <button class="btn btn-primary" id="btn-register" v-if="!contactLocal._id">Đăng ký</button>
        <button class="btn btn-primary" v-if="contactLocal._id">Lưu</button>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import ContactService from "@/services/bookstore.service";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:contact",],
    props: {
        contact: { type: Object, required: true },

    },
    data() {
        const contactFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự")
                .max(50, "Tên nhiều nhất có 50 ký tự."),
            email: yup
                .string()
                .email("Email không đúng")
                .max(50, "Email tối đa 50 ký tự"),
                
                
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự"),
            phone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ"
                )

        });
        return {
            contactLocal: this.contact,
            contactFormSchema,
            listContact: [],
            showpass: false,
        };
    },
    methods: {
        submitUser() {
            for(let i = 0; i < this.listContact.length ; i++) {
                if(this.contactLocal._id == this.listContact[i]._id) break;
                    if(this.contactLocal.phone == this.listContact[i].phone) {
                        alert("Số điện thoại này đã tồn tại");
                        return;
                    } else if(this.contactLocal.email == this.listContact[i].email) {
                        alert("Email này đã tồn tại");
                        return;
                    }
                }
            this.$emit("submit:contact", this.contactLocal);
            
        },

        selectAvatar() {
            this.$refs.fileInput.click();
        },

        onChange(event) {
            const files = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.contactLocal.avatar = event.target.result;
                };
                reader.readAsDataURL(files);
        },

        showPassword() {
            const PassInput = document.getElementById('passWords');
            if(PassInput.type === 'password'){
                this.showpass = true;
                PassInput.type = 'text';
            } else {
                this.showpass = false;
                PassInput.type = 'password';
            }

        },

        async retrieveContacts() {
            try {

                this.listContact = await ContactService.getAll();

            }
            catch (error) {
                console.log(error);
            }
        },
        filteredContacts() {
            for (let i = 0; i < this.listContact.length; i++) {
                if (this.contactLocal.phone == this.listContact[i].phone) {
                    return;
                }
            }
        },
    },
    computed: {
        contactStrings() {
            return this.listContact.map((listContact) => {
                const { name, email, address, phone } = listContact;
                return [name, email, address, phone].join("");
            });
        },

    },
    mounted() {
        this.retrieveContacts();
    }
};
</script>

<style scoped>
.file{
    display: none;
}
.input-section{
    position: relative;
    margin-bottom: 10px;
    margin-top: 5px;
    text-align: left;
    max-width: 270px;
    width: 250px;
    border-bottom: 1px solid;
}
.show-password{
    position: absolute;
    bottom: 70px;
    right: 90px;
}
.form-control{
    border: none;
}
.show-password-signup{
    position: absolute;
    bottom: 25%;
    right: 7%;
}
</style>