
<template>
    <!-- <div class="welcome-app">
        <div class="container" id="container">
            <div class="form-container sign-up-container">
                <regisForm :contact="contact" @submit:contact="createContact" />
            </div>
            <div class="form-container sign-in-container">
                <LoginForm :users="users" @submit:users="getUsers" />
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>Xin chào!</h1>
                        <p>Nếu bạn đã đăng ký thành công. Mời bạn quay lại trang đăng nhập.</p>
                        <button class="ghost" id="signIn" @click="retriveUser">Đăng nhập</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>Xin chào!</h1>
                        <p>Bạn vui lòng đăng nhập trước khi sử dụng dịch vụ của chúng tôi</p>
                        <h4>Nếu bạn chưa có tài khoản, hãy đăng ký tài khoản mới</h4>
                        <button class="ghost" id="signUp" @click="toggleTab">Đăng ký</button>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="login-page">
        <div class="wrapper">
            <div class="form-box login">
                <h2>Đăng nhập</h2>
                <LoginForm :users="users" @submit:users="getUsers" />
                <div class="login-register" style="text-align: center;">
                    <p>Bạn chưa có tài khoản?<i class="register-link" @click="changeSignin">Đăng kí</i></p>
                </div>
                <div class="forgot-password" data-bs-toggle="modal" data-bs-target="#forgotPassword">
                    <p>Quên mật khẩu</p>
                </div>
            </div>
            <div class="form-box register">
                <h2>Đăng ký</h2>
                <regisForm :contact="contact" @submit:contact="createContact" />
                <div class="register-login" style="text-align: center;">
                    <p>Bạn đã có tài khoản?<i class="login-link" @click="changeSignup">Đăng nhập</i></p>
                    
                </div>
            </div>
        </div>
        <div class="modal fade" id="forgotPassword">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Bạn quên mật khẩu?</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-email-forgot">
                            <input type="email" placeholder="Vui lòng nhập email" class="form-control" name="forgotEmail" ref="forgotEmail" @keyup.enter="sendRequie">
                        </div>
                        <div class="confirm-email" style="margin-top: 10px;">
                            <button class="btn btn-primary" @click="sendRequie">Gửi</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="edit">
                            <i class="fa-solid fa-pen-to-square" @click="doEdit" data-bs-toggle="modal"
                                data-bs-target="#myModal3" v-if="checkAdmin"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import regisForm from "@/components/regisForm.vue";
import ContactService from "@/services/bookstore.service";
import LoginForm from "../components/loginForm.vue";
import Swal from 'sweetalert2'
import bookstoreService from "../services/bookstore.service";


export default {
    components: {
        regisForm,
        LoginForm,
    },
    data() {
        return {
            contact: {
                name: "",
                email: "",
                address: "",
                phone: "",
                password: "",
            },
            message: "",
            users: {
                email: "",
                password: "",
            },
            listUsers: [],
            forgotMail: {
                email:'',
            },
            check:false,
        };
    },

    methods: {
        createContact() {
            try {
                ContactService.create(this.contact);
                this.message = "Đã tạo tài khoản mới ";
                Swal.fire({
                        title: "Đăng ký thành công",
                        text: "You clicked the button!",
                        icon: "success",
                        allowOutsideClick: false,
                        showConfirmButton: true
                    })
            }
            catch (error) {
                console.log(error);
            }
        },
        getUsers() {
            let test = 0;
            for (let i = 0; i < this.listUsers.length; i++) {
                if (this.users.email == this.listUsers[i].email && this.users.password == this.listUsers[i].password) {
                    test = 1;
                    Swal.fire({
                        title: "Đăng nhập thành công",
                        text: "You clicked the button!",
                        icon: "success",
                        allowOutsideClick: false,
                        showConfirmButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.$router.push({
                                name: "home",
                                params: {
                                    id: this.listUsers[i]._id,
                                }
                            });
                        }
                    })

                } else {
                    continue;
                }
            }
            if (test == 0) {
                    Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "Email hoặc mật khẩu sai rồi!",
                    });
                }
        },

        async retriveUser() {
            try {
                this.listUsers = await ContactService.getAll();
            }
            catch (error) {
                console.log(error);
            }
        },

        changeSignin() {
            const wrapper = document.querySelector('.wrapper');
                wrapper.classList.add('active');
        },
        changeSignup() {
            this.retriveUser();
            const wrapper = document.querySelector('.wrapper');
            wrapper.classList.remove('active');
        },
        async sendRequie() {
            this.forgotMail.email = this.$refs.forgotEmail.value;
            for (const user of this.listUsers){
                if(this.forgotMail.email == user.email) {
                    console.log("Đúng");
                    await bookstoreService.sendRequireMail(this.forgotMail);
                    this.check= true;
                    Swal.fire({
                        icon: "info",
                        title: "Hãy kiểm tra Email của bạn",
                        text: "Chúng tôi đã gửi mật khẩu đến Email của bạn",
                    });
                    break;
                } 
                this.check = false;
            }
            if(!this.check) {
                Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "Email sai hoặc chưa được đăng kí!",
                    });
            }
        },
    },
    mounted() {
        this.retriveUser();

    },
}
</script>

<style>
    .sign-up-container{
        overflow: auto;
    }
    .forgot-password{
        position: absolute;
        right: 30%;
        color: rgb(175, 19, 157);
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        cursor: pointer;
        & p{
            font-weight: bold;
            padding: 5px;
            &:hover{
                background: rgba(0, 217, 255, 0.308);
                border-radius: 5px;
                transition: .5s ease;
            }
        }
    }
    .login-register{
        margin-top: 10px;
        & p{
            font-size: 15px;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            & i{
                color: blue;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
    .register-login{
        margin-top: 10px;
        & p{
            font-size: 15px;
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            & i{
                color: blue;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
</style>