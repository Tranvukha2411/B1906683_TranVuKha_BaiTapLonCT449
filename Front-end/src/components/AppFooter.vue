<template>
    <button class="btn btn-danger" @click="updateCheck">Xóa</button>
</template>
<script>
    export default {
        props: {
            check: {type: Boolean, requied: true},
        },
        data() {
            return {
                isChecked:false,
            }
        },
        emits: ['update:check'],
        methods: {
            updateCheck() {
                if(this.check == true) {
                    this.isChecked = false;
                    console.log(this.isChecked);
                    this.$emit('update:check',this.isChecked);
                } else{
                    this.isChecked = true;
                    console.log(this.isChecked);
                    this.$emit('update:check',this.isChecked);
                }
            },
        },
    }
</script>