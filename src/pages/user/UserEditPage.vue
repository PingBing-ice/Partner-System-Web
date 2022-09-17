<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 通过 pattern 进行正则校验 -->
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :placeholder="`请输入:${editUser.editName}`"
          :label="editUser.editName"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../../services/users";




const route = useRoute()
const router = useRouter()
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

const onSubmit = async (values) => {
  const currentUser = await  getCurrentUser();
  if (!currentUser) {
    Toast.fail("用户未登录");
    return;
  }
  const res = await myAxios.post("/api/user/update", {
    "id": currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  });

  if (res.code === 200 && res.data > 0) {
    Toast.success('修改成功');
    await router.push({path: "/user"})
  }else {
    Toast.fail("修改失败");
  }
}
</script>

<style scoped>

</style>
