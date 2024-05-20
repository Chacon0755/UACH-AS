import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { Post } from '../models/forum.model';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { AdvisoryService } from '../services/advisory.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css'
})

export class StudentHomeComponent implements OnInit {
  student: Student = {
    schoolId: 0,
    name: '',
    lastName1: '',
    lastName2: '',
    majorId: 1,
    numberOfSemester: 1,
    email: '',
    profilePicture: '',
    role: 'student',
    password: ''
  }
  
  selectedFile: File | null = null
  posts: Post[] = [];
  newPostContent: string = '';
  newResponseContent: string = '';
  userRole: string = 'student';
  courses: string[] = [];
  advisorys: any[] = [];


  constructor(private authService: AuthService, private router: Router, private forumService: ForumService, private studentService: StudentService, private advisoryService: AdvisoryService) { }
  
  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.loadStudentData(userDetails.id);
      this.loadProfileImage(userDetails.id);
      this.loadStudentAdvisorys(userDetails.id);
    }
  }

  loadProfileImage(studentId: number): void{
    this.studentService.getProfilePicture(studentId).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.student.profilePicture = e.target.result;
      };
      reader.readAsDataURL(blob);
      console.log(this.student.profilePicture)
    })
  }
  loadStudentData(studentId: number): void {
    this.studentService.getStudentDataById(studentId).subscribe({
      next: (student) => {
        if (student) {
          const studentData = student[0];
          this.student = {
            schoolId: studentData.matricula,
            name: studentData.nombre,
            lastName1: studentData.ape1,
            lastName2: studentData.ape2,
            majorId: studentData.programa,
            numberOfSemester: studentData.semestre,
            email: studentData.correo,
            profilePicture: '',
            role: studentData.rol,
            password: ''
          }
          console.log('estudiante de DB: ', student);
          console.log('estudiante con datos: ', this.student)
        }
      }
    });
  }

  loadStudentAdvisorys(studentId: number): void{
    this.advisoryService.getAdvisorysByStudentId(studentId).subscribe({
      next: (advisorys) => {
        this.advisorys = advisorys;
        console.log('Asesorias: ', this.advisorys);
      },
      error: (error) => {
        console.error('Error al obtener asesorias: ', error);
      }
    });
  }

  logOut() {
    this.router.navigate(['/login'])
  }

  loadPosts(): void{
    this.forumService.getPosts().subscribe(posts => {
      this.posts = posts;
    })
  }

  postPublication(): void{
    if (this.newPostContent.trim()) {
      const newPost: Post = {
        id: 0,
        author: this.student.name,
        role: this.student.role,
        content: this.newPostContent,
        createdAt: new Date(),
        responses: []
      };
      this.forumService.addPost(newPost).subscribe(post => {
        this.posts.push(post);
        this.newPostContent = '';
      });
    }
  }

  reply(postId: number, postIndex: number, archivoAdjunto: File | null): void {
    if (this.newResponseContent.trim()) {
      //const response: Response = {
      const formData = new FormData();
      formData.append('content', this.newResponseContent);
      if (archivoAdjunto) {
        formData.append('archivoAdjunto', archivoAdjunto);
      }
      //   id: 0,
      //   author: this.userName,
      //   role: this.userRole,
      //   content: this.newResponseContent,
      //   createdAt: new Date()
      // };
      // this.forumService.addResponse(postId, response).subscribe(res => {
      //   this.posts[postIndex].responses?.push(res);
      //   this.newResponseContent = ';'
      // });
      this.forumService.addResponse(postId, formData).subscribe(res => {
        this.posts[postIndex].responses?.push(res);
        this.newResponseContent = '';
    
      });
  
    }
  }
  

  // loadStudentData(): Student{
  //   const studentId = 1; //cambiar
  //   this.studentService.getStudentDataById(studentId).subscribe({
  //     next: (response) => {
  //       return response
  //     },
  //     error: (error) => console.error('Sigo sin poder Martha ', error),
  //   });
  // }


  onFileSelectedEvent(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.student.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);

    this.onUpload();
  }

  onUpload(): void{
    if (this.selectedFile) {
      const studentId = this.student.schoolId;
      this.studentService.uploadProfileImage(studentId, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Foto subida correctamente ', response)
        },
        error: (error) => {
          console.error('Error al subir la foto de perfil ', error);
        }
      });
    }
  }
    
}
