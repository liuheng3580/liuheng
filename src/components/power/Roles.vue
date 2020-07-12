<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

<!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
         <el-row>
     <el-col>
    <el-button type="primary"  @click="addDialogVisible = true">添加角色</el-button>
     </el-col>
           </el-row>
           <!-- 角色列表区域 -->
           <el-table :data="roleslist" border stripe>
                   <!-- 展开列 -->
               <el-table-column type="expand">
                   <template slot-scope="scope">
                       <el-row :class="['bdbutton', i1 === 0 ?'bdtop':'','vcenter']"  v-for="(item1,i1) in scope.row.children" :key="item1.id">
                           <!-- 渲染一级权限 -->
                           <el-col :span="5">
                               <el-tag  @close="removeRightById(scope.row,item1.id)"">{{item1.authName}}</el-tag>
                               <i class="el-icon-caret-right"></i>
                               </el-col>
                            <!-- 渲染二级权限和三级权限 -->
                           <el-col :span="19">
                               <!-- 通过for循环嵌套渲染二级权限 -->
                               <el-row :class="[ i2 === 0 ?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                   <el-col :span="6">
                                       <el-tag type="success" closable
                                        @close="removeRightById(scope.row,item2.id)"">{{item2.authName}}</el-tag>
                                       <i class="el-icon-caret-right"></i>
                                   </el-col>
                                   <el-col :span="18">
                                       <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable
                                       @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                   </el-col>
                               </el-row>
                           </el-col>
                       </el-row>
                   </template>
               </el-table-column>
               <!-- 索引列 -->
               <el-table-column type="index"></el-table-column>
               <el-table-column label="角色名称" prop="roleName"></el-table-column>
               <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
               <el-table-column label="操作" width="300px">
                   <template slot-scope="scope">
                       <el-button type="primary" icon="el-icon-edit" size="mini" @click="show(scope.row.id)">编辑</el-button>
                       <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row.id)">删除</el-button>
                       <el-button type="warning" 
                       icon="el-icon-setting" 
                       size="mini"
                       @click="showSetRigsetRightDialog(scope.row)">分配权限</el-button>
                   </template>
               </el-table-column>
           </el-table>

   <el-dialog
  title="修改用户"
  :visible.sync="showVisible"
  width="50%"
  @close="eidClose">
  <el-form :model="eidForm"
   :rules="eidFormRules" 
   ref="eidFormRef" 
   label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="eidForm.roleName"></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="eidForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showVisible = false">取 消</el-button>
    <el-button type="primary" @click="eidUser">确 定</el-button>
  </span>
</el-dialog>        


<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClose">
  <el-form :model="addForm"
   :rules="addFormRules" 
   ref="addFormRef" 
   label-width="80px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogClosed">
  <!-- 树形控件 -->
  <el-tree :data="rightlist" :props="treeProps"  show-checkbox node-key="id"
  default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>

</template>
<script>
export default {
    data(){
        return{
            // 所有角色列表数据
            roleslist:[],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            rightlist:[],
            // 树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children',
            },
             // 默认选中的节点Id值数组
            defKeys:[105,116],
            roleId:'',
            addDialogVisible:false,
            addForm:{
        roleName:'',
        roleDesc:'',
            },
            addFormRules:{
          roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc:[
           { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
            },
            showVisible:false,
            eidForm:{},
            eidFormRules:{
               roleName: [
          { required: true, message: '请输入修改的角色名称', trigger: 'blur' },
        ],
        roleDesc:[
           { required: true, message: '请输入修改的角色描述', trigger: 'blur' },
        ],
            },
        }
    },
    created(){
      this.getRolesList()
    },
    methods:{
   async getRolesList(){
       //获取所有角色的列表
   const{data:res} =  await  this.$http.get('roles')
   if(res.meta.status !==200){return this.$message.error('获取角色列表失败')}
   this.roleslist = res.data
   console.log(this.roleslist)
    },
    // 根据Id删除对应的权限
 async  removeRightById(role,rightId){
        //弹框提示用户是否需要删除
     const confirmResult=  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err => err)
if(confirmResult !='confirm'){
    return this.$message.info('取消了删除')
}
   const{data:res} = await this.$http.delete( `roles/${role.id}/rights/${rightId}`)
if(res.meta.status !==200){return this.$message.error('删除权限失败！')}

    //this.getRolesList()
   role.children = res.data
    },
   async  showSetRigsetRightDialog(role){
this.roleId = role.id
        //获取所有权限的数据
    const {data:res} = await  this.$http.get('rights/tree')
    if(res.meta.status !==200){return this.$message.error('获取权限数据失败')}
    //获取到的权限数据保存到data中
    this.rightlist = res.data
    console.log(this.rightlist)

    // 递归获取三级节点的Id
       this.getLeafKeys(role,this.defKeys)
this.setRightDialogVisible = true
    },
// 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node,arr){
         // 如果当前 node 节点不包含 children 属性，则是三级节点
if(!node.children){
    return arr.push(node.id)
}
node.children.forEach(item => this.getLeafKeys(item, arr))
    },
     // 监听分配权限对话框的关闭事件
setRightDialogClosed(){
    this.defKeys =[]
},
  // 点击为角色分配权限
 async allotRights(){
const keys = [...this.$refs.treeRef.getCheckedKeys(),
...this.$refs.treeRef.getHalfCheckedKeys]
const idStr = keys.join(',')
const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
if(res.meta.status !==200){return this.$message.error('分配权限失败！')}
 this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false

},
addClose(){
  this.$refs.addFormRef.resetFields()
},
addUser(){
  this.$refs.addFormRef.validate(async valid =>{
             if(!valid) return
             //可以发起添加用户的网络请求
             const{data:res} =await this.$http.post('roles',this.addForm)
             if(res.meta.status !==201) {
               this.$message.error('添加用户失败！')
             }
             this.$message.success('添加用户成功!')
            // 隐藏添加用户的对话框
             this.addDialogVisible = false
              //  重新获取用户列表数据
            this.getUserList()
           })
},
async show(id){
 const {data:res} =await this.$http.get('roles/'+id)
 if(res.meta.status !==200){return this.$message.error('查询用户信息失败！')}
 this.eidForm = res.data
this.showVisible = true

},
eidClose(){
  this.$refs.eidFormRef.resetFields()
},
eidUser(){
  this.$refs.eidFormRef.validate(async valid =>{
   if(!valid)return
 const{data:res}= await  this.$http.put('roles/' +this.eidForm.roleId,{
   roleName:this.eidForm.roleName,
   roleDesc:this.eidForm.roleDesc})
 if(res.meta.status !== 200){return this.$message.error('更新用户失败！')}
 this.showVisible = false
 this.getRolesList()
 this.$message.success('更新用户信息成功！')
  })
},
async open(id){
  const rll= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if(rll !== 'confirm') {
        return this.$message.info('已取消删除')
      }
  const {data:res}= await this.$http.delete('roles/'+id)
  if(res.meta.status !== 200){return this.$message.error('删除用户失败！')}
  this.$message.success('删除用户成功！')
  this.getRolesList()

}

    }
}
</script>
<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbutton{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}


</style>