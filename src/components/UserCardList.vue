<template>

  <van-card v-if="props.userList&& props.userList.length>0" v-for="user in props.userList"
            :desc="user.profile"
            :title="user.userAccount"
            :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain style="margin-right: 8px; margin-top: 10px;color: #4a94af;border-radius: 10px;" type="danger"
               v-for="tag in user.tags">
        {{ tag }}
      </van-tag>
    </template>
    <template #num>
      <van-button size="mini" @click="isShow(user.id)">添加好友</van-button>
    </template>
  </van-card>
  <van-empty v-if="!props.userList||props.userList.length<=0" description="数据为空"/>
  <van-dialog v-model:show="show" title="确认添加好友吗?" @confirm="sendFriendRequest" @closed="close" show-cancel-button>
    <van-cell-group inset>
      <van-field
          v-model="message"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="请输入备注"
      />
    </van-cell-group>
  </van-dialog>
</template>

<script setup lang="ts">
import {UserType} from "@/plugins/request/dao/user";
import {showToast} from 'vant';
import {ref} from "vue";
import userRequest from "@/plugins/request/userRequest";

const show = ref(false);
const message = ref('');
const userId = ref<number>(0);

const emits = defineEmits(['userId'])

interface UserCardListType {
  userList: UserType[];
}

const props: UserCardListType = withDefaults(defineProps<UserCardListType>(), {
  userList: [] as any,
})

const sendFriendRequest =async () => {
  if (userId.value === 0) {
    return;
  }
  const resp =await userRequest.addFriend(userId.value, message.value);

  if (resp.code == 200) {
    if (resp.data && resp.data === 1) {
      showToast({message: '发送成功', position: 'top'});
      return
    }
    showToast({message: '同意好友申请', position: 'top'});
  } else {
    if (resp.description) {
      showToast({message: resp.description, position: 'top'});
    }
  }

}
const close = () => {
  message.value = '';
  userId.value = 0;
}
const isShow = (id: string) => {
  emits("userId", id)
}
</script>

<style scoped>

</style>
