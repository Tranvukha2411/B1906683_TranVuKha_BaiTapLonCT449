<template>
    <div class="modal fade" id="myModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <AddProductForm></AddProductForm>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import bookstoreService from '../services/bookstore.service';
    import AddProductForm from './AddProductForm.vue';
    export default {
        props: {
            id: {type: String, required: true},
            productID: {type: String, required: true},
        },
        components: {
            AddProductForm,
        },
        data() {
            return {
                
            }
        },
    }
</script>