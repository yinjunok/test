<template>
  <div id="app">
    <van-row>
      <van-col span="24">
        <div class="banner-wrap">
          <img class="banner" src="./assets/school.jpg" alt>
          <span class="banner-title">华中师范大学在校生项目报名</span>
        </div>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <div class="intro">
          <van-panel title="请填写以下信息, 提交后, 请关注微信公众号, 了解报名项目的相关信息">
            <van-cell-group>
              <van-field required v-model="name" label="姓名" placeholder="请输入姓名"/>
              <van-field required v-model="mobile" maxlength='11' type="number" label="手机" placeholder="请输入手机号码"/>
              <van-field required v-model="qq" type="number" label="QQ" placeholder="请输入QQ"/>
            </van-cell-group>
            
            <div class="row">
              <div class="title"> <span class="required">*</span> 类别</div>
              <div class="value">
                <van-radio-group v-model="type">
                  <van-radio name="0">本科生</van-radio>
                  <van-radio name="1">研究生</van-radio>
                </van-radio-group>
              </div>
            </div>

            <van-cell-group>
              <van-field required v-model="department" label="院系" placeholder="请输入所在院系"/>
            </van-cell-group>


             <div class="row">
              <div class="title"><span class="required">*</span>请选择所在 <br /> 年级</div>
              <van-radio-group v-model="grade">
                <van-radio name="1">一年级</van-radio>
                <van-radio name="2">二年级</van-radio>
                <van-radio name="3">三年级</van-radio>
                <van-radio name="4">四年级</van-radio>
              </van-radio-group>
            </div>

            <div class="row">
              <div class="title"><span class="required">*</span>报名项目</div>
              <van-radio-group v-model="entry_project" @change="pickProjectChange">
                <van-radio name="1">短期交流项目</van-radio>
                <div v-if="entry_project === '1'" class="project-input">
                  <van-field v-model="pick_project" placeholder="请填写具体项目名称" />
                </div>
                <van-radio name="2">跋园雅托高能班</van-radio>
                <van-radio name="3">其他</van-radio>
              </van-radio-group>
            </div>

            <van-cell-group>
              <van-field v-model="email" label="邮箱" placeholder="请输入电子邮箱"/>
            </van-cell-group>

            <div class="row">
              <div class="title">是否参加过 <br> 英语考试 <br> (可多选)</div>
              <div class="value">
                <van-checkbox-group v-model="english_test">
                  <van-checkbox
                    v-for="(item, index) in english_test_list"
                    :key="item"
                    :name="index + 1"
                  >
                    {{ item }}
                  </van-checkbox>
                </van-checkbox-group>
              </div>
            </div>

            <van-cell-group>
              <van-field
                v-model="remark"
                type="textarea"
                label="留言"
                placeholder="如需要有其他说明的情况请留言"
              />
            </van-cell-group>
            <div slot="footer">
              <van-button @click="submit" :loading="submiting" loading-text="提交中..." size="large" type="primary">提交</van-button>
            </div>
          </van-panel>
        </div>
      </van-col>
    </van-row>

    <van-dialog
      v-model="showError"
      show-cancel-button
    >
    <div class="error-list">
      <p
        v-for="(item) in error_list"
        :key="item"
      >
        {{ item }}
      </p>
    </div>
    </van-dialog>

    <van-dialog v-model="submitSuccess">
      <div class="submit-success">
        提交成功, 请关注微信公众号, 了解报名项目的相关信息.
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { post } from 'axios';
import { stringify } from 'qs';
import {
  Button,
  Row,
  Col,
  Panel,
  Field,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Toast,
} from "vant";

export default {
  name: "app",
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Panel.name]: Panel,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
  },
  data() {
    return {
      // 必选字段
      name: '',
      mobile: '',
      type: '',
      department: '',
      grade: '',
      entry_project: 0,
      pick_project: '',
      qq: '',

      // 不是必选字段
      email: '',
      remark: '',
      english_test: [],
      english_test_list: ['雅思', '托福', '四级', '六级', '其他'],
      error_list: [],

      // 错误弹窗控制
      showError: false,

      // 提交成功弹窗控制
      submitSuccess: false,

      // 提交中
      submiting: false,
    };
  },
  methods: {
    // 检查表单字段是否符合要求
    // 不和要求的信息放入 error_list
    checkForm() {
      this.error_list = [];
      
      if (this.name === '') {
        this.error_list.push('名字不能为空');
      }

      if (this.mobile === '' || this.mobile.length < 11) {
        this.error_list.push('手机号格式错误');
      }

      if (this.grade === '') {
        this.error_list.push('年级必选');
      }

      if (this.type === '') {
        this.error_list.push('类别必选');
      }

      if (this.department === '') {
        this.error_list.push('院系必填');
      }

      if (this.pick_project === '') {
        this.error_list.push('报名项目必填');
      }

      if (this.qq === '') {
        this.error_list.push('QQ 号不能为空');
      }
    },
    async submit() {
      // 如果表单正在提交, 则终止
      // 防止重复提交表单
      if (this.submiting === true) {
        return;
      }

      // 如果 error_list 里有错误消息,
      // 说明表单字段不合要求
      // 弹出错误提示, 终止提交
      this.checkForm();
      
      if (this.error_list.length > 0) {
        this.showError = true;
        return;
      }
      
      // 序列化表单字段
      const data = stringify({
        name: this.name,
        mobile: this.mobile,
        email: this.email,
        type: this.type,
        department: this.department,
        grade: this.grade,
        entry_project: this.pick_project,
        remark: this.remark,
        qq: this.qq,
        english_test: this.english_test.join(','),
      });

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      };

      this.submiting = true;
      const { data: resData } = await post(
        'http://huashida.kzmooc.com/student_report_add',
        data,
        headers
      );

      if (resData.status === 1) {
        // Toast.success(`${resData.msg}. 请关注微信公众号, 了解报名项目的相关信息`);
        this.submitSuccess = true;
      } else {
        this.error_list.push(resData.msg);
        this.showError = true;
      }
      this.submiting = false;
    },

    pickProjectChange(name) {
      if (name === '1') {
        this.pick_project = '';
      }

      if (name === '2') {
        this.pick_project = '跋园雅托高能班';
      }

      if (name === '3') {
        this.pick_project = '其他'
      }
    }
  }
};
</script>

<style lang="less">
#app {
  background: rgba(80, 152, 152, 1);
}

.banner-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;

  .banner {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .banner-title {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 16px;
    padding: 8px 20px;
  }
}

.intro {
  margin: 20px 10px;
  padding: 0 5px;
  border-radius: 5px;
  overflow: hidden;

  .van-cell {
    background: rgba(80, 152, 152, .1);
  }

  .van-panel__footer {
    background: rgba(80, 152, 152, .1);
  }

  .row {
    display: flex;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 24px;
    background: rgba(80, 152, 152, .1);
    
    .title {
      max-width: 90px;
      flex: 1;
    }

    .value {
      flex: 1;
    }
  }

  .line {
    width: 100%;
    height: 1px;
    background: #ebedf0;
    transform: scaleY(.5);
  }
}

.required {
  color: #f44;
  font-size: 14px;
  margin-left: -11px;
}

.error-list {
  padding: 0 20px;

  p {
    color: #f44;
    font-size: 16px;
  }
}

.van-cell:not(:last-child)::after {
  left: 0;
}

.submit-success {
  color: #000;
  font-size: 16px;
  padding: 20px 20px 10px;
  line-height: 1.5;
}

.project-input {
  width: 100%;
  
  .van-cell {
    padding: 5px;
    margin-left: 27px;
    background: rgba(80, 152, 152, .2);
  }
}
</style>
