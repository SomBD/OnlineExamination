import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BackendApisService } from '../services/backend-apis.service';
// export interface ASSESTMENT {
//   position: number;
//   question: string;
//   nlp_answer: string;
//   given_answer: string;
//   result: string;
// }

export interface ASSESTMENT {
  position: number;
  question: string;
  student_answer: string;
  llm_answer: string;
  gpt_result: string;
  sbert_result: string;
  gpt_feedback: string;
  score: string;
}

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-attempt-question',
  templateUrl: './attempt-question.component.html',
  styleUrl: './attempt-question.component.css'
})
export class AttemptQuestionComponent implements OnInit {
  isVisible: boolean = false;
  isOverAllResultPass: boolean = false;
  constructor(private backendApisService: BackendApisService) {

  }
  
  ngOnInit(): void {
    let results = localStorage.getItem('results') ?? '';
    let parsedResults = JSON.parse(results);
    console.log("parsedResults >>>>>>>>>>>>");
    console.log(parsedResults);
    this.ASSESTMENT = [];
    for(let i = 0; i < parsedResults.length; i++) {
      console.log(parsedResults[i].question);
      this.ASSESTMENT[i] = {
        position: i + 1,
        question: parsedResults[i].question,
        student_answer: parsedResults[i].student_answer,
        llm_answer: parsedResults[i].llm_answer,
        gpt_result: parsedResults[i].result,
        gpt_feedback: parsedResults[i].feedback,
        sbert_result: '',
        score: parsedResults[i].score.toString()
      };
  
    }
    this.isVisible = true;
    this.dataSource = new MatTableDataSource(this.ASSESTMENT);  
    // this.backendApisService.getAnswersFromCandidate().subscribe(
    //   response => {
    //     this.ASSESTMENT = [];
    //     let results = localStorage.getItem('results') ?? '';
    //     let parsedResults = JSON.parse(results);
    //     for(let i = 0; i < parsedResults.length; i++) {
    //       this.ASSESTMENT[i].position = i+1;
    //       this.ASSESTMENT[i].question = parsedResults[i].question;
    //       this.ASSESTMENT[i].student_answer = parsedResults[i].question;
    //       this.ASSESTMENT[i].llm_answer = parsedResults[i].question;
    //       this.ASSESTMENT[i].gpt_result = parsedResults[i].question;
    //       this.ASSESTMENT[i].gpt_feedback = parsedResults[i].question;
    //       this.ASSESTMENT[i].score = parsedResults[i].question;
    //     }
    //     this.isVisible = true;
    //     this.dataSource = new MatTableDataSource(this.ASSESTMENT);      
    //   },
    //   error => {
    //     console.error('Error:', error);
    //   }
    // );
    //let assessment: string = localStorage.getItem('attemptedQuestions') ?? '';
    this.isOverAllResultPass = this.isGreaterThanOrPassingPercentage(this.calculateTotalPercentage(this.ASSESTMENT));
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'question', 'student_answer', 'llm_answer', 'gpt_result', 'sbert_result', 'gpt_feedback', 'score'];
  ASSESTMENT: ASSESTMENT[] = [];
  dataSource = new MatTableDataSource(this.ASSESTMENT);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isGreaterThanOrPassingPercentage(result: string): boolean {
    return  Number(result) >= 0.5;
  }

  calculateTotalPercentage(assessment: ASSESTMENT[]): string {
    let total: number = 0;
    for(let i=0; i< assessment.length; i++){
      total = total + Number(assessment[i].score);
    } 
    let avarageTotal: number = total / (assessment.length + 1);
    return  Number(avarageTotal.toFixed(5)).toString();
  }
}