function randomInteger(min, max) {
    let rand = Math.random() * (max - min + 1) + min;
    rand = Math.floor(rand);
    return rand;
}

function createRandomProject(){
    const cmplxt = randomInteger(1, 3);
    const d = randomInteger(0, 1);
    let drct = d ? "web" : "mobile";
    return new Project(drct,cmplxt);
}

class Project {
    constructor(direction, complexity) {
        this.direction = direction;
        this.complexity = complexity;
        this.day_to_dev = complexity;
        this.team = 0;
    }
}

class Employee {
    constructor() {
        this.on_work = 0;
        this.day_without_project = 0;
        this.exp = 0;
    }
} 

class Director {
    constructor() {
        this.def_Projects = [];
        this.Projects_to_test = [];
        this.new_projects = [];
    }

    sendToDev(department) {
        if (this.def_Projects.length) {
            for ( let i =this.def_Projects.length; i > 0; i--){
                const proj = this.def_Projects[i-1];
                if (department.direction === proj.direction) {
                    if (department.takeProject(proj)) {
                        department.addEmployee();
                        department.takeProject(proj);
                        this.def_Projects.splice(i-1, 1);
                    }
                }
            }
        }
        if (this.new_projects.length) {
            for (let i = this.new_projects.length; i > 0; i--) {
                const proj = this.new_projects[i-1];
                if (department.direction === proj.direction) {
                    if (department.takeProject(proj)) {
                        this.def_Projects.push(proj);
                        this.new_projects.splice(i-1, 1);
                    }
                }
            }
        }
    }

    sendToTest(test_department,department) {
        if (this.Projects_to_test.length) {
            for (let i = this.Projects_to_test.length; i > 0; i--){
                const old_proj = this.Projects_to_test.pop();
                if (test_department.takeProject(old_proj)) {
                    test_department.addEmployee();
                    test_department.takeProject(old_proj);
                }
            }
        }
        let proj;
        do {
            proj = department.findFinProject();
            if (proj){
                if (test_department.takeProject(proj)) {
                    this.Projects_to_test.push(proj);
                }
            }
        }while (proj);
    }

    newDay (depart_1,depart_2,depart_3) {
        depart_1.nextDay();
        depart_2.nextDay();
        depart_3.nextDay();
    }

    dismissEmployees(depart_1,depart_2,depart_3) {
        depart_1.deleteEmloyees();
        depart_2.deleteEmloyees();
        depart_3.deleteEmloyees();
    }

    deleteCompletedProjects(depart_1,depart_2,depart_3){
        depart_1.deleteProjects();
        depart_2.deleteProjects();
        depart_3.deleteProjects();
    }
}

class Department {
    constructor(direction) {
        this.Projects = [];
        this.Employees = [];
        this.fired_employees = 0;
        this.hired_employees = 0;
        this.free_employees = 0;
        this.completed_projects = 0;
        this.direction = direction;
    }

    addEmployee() {
        this.Employees.push(new Employee());
        this.hired_employees++;
    }

    deleteEmloyees() {
        if (this.Employees.length){
            let min_exp = this.Employees[0].exp;
            let bad_empl;
            for (let i = 0; i < this.Employees.length; i++) {
                if (this.Employees[i].day_without_project > 2) {
                    if (min_exp > this.Employees[i].exp) {
                        bad_empl = i;
                    }
                }
            }
            if (bad_empl >= 0) {
                this.Employees.splice(bad_empl, 1);
                this.fired_employees++;
            }
        }   
    }
    
    findFreeEmployees() {
        let free_index;
        this.free_employees = 0;
        for (let i = 0; i < this.Employees.length; i++) {
            if (this.Employees[i].on_work == 0) {
                this.free_employees++ ;
                free_index = i;              
            }
        }
        return free_index;
    }

    deleteProjects() {
        for (let i = 0; i < this.Projects.length; i++){
            if (this.Projects[i].day_to_dev <= 0) {
                this.Projects.splice(i--, 1);
                this.completed_projects++;
            } 
        }        
    }

    takeProject(project) {
        let proj = project;
        let e_indx = this.findFreeEmployees();
        if (proj.direction === this.direction) {
            if (e_indx >= 0) {
                proj.team++;
                proj.day_to_dev = Math.ceil(proj.complexity / proj.team);
                this.Projects.push(proj);
                this.Employees[e_indx].exp++;
                this.Employees[e_indx].day_without_project = 0, 
                this.Employees[e_indx].on_work = proj.day_to_dev;
                this.findFreeEmployees();
                return false;
            }
        }
        return project;
    }

    findFinProject() {
        for (let i = this.Projects.length; i > 0; i--){
            if ((this.Projects[i-1].day_to_dev <= 0) && (this.Projects[i-1].direction !== "test")){
                const project = this.Projects[i-1];
                project.team = 0;
                project.complexity = 1;
                project.direction = "test"; 
                return project;
            }
        }
        return false;
    }

    nextDay() {
        for (let i = 0; i < this.Employees.length; i++) {
            if (this.Employees[i].on_work === 0) {
                this.Employees[i].day_without_project++;
            } else {
                this.Employees[i].on_work--;
            }
        }
        for (let i = 0; i < this.Projects.length; i++) {
            this.Projects[i].day_to_dev--;
        }
    }
}

class Mob_Department extends Department {
    constructor(){
        super ("mobile");
    }

    takeProject(project) {
        let proj = project;
        let e_indx = this.findFreeEmployees();
            if (project.direction === this.direction) {
                if(e_indx >= 0){
                    let indx_arr=[];
                        while ((proj.team != proj.complexity) && (this.free_employees)) {
                            this.Employees[e_indx].on_work = -1;
                            proj.team++;
                            indx_arr.push(e_indx);                       
                            e_indx = this.findFreeEmployees();
                        }
                        proj.day_to_dev = Math.ceil(proj.complexity / proj.team);
                        indx_arr.forEach((i) => {
                            this.Employees[i].on_work = proj.day_to_dev;
                            this.Employees[i].exp++;
                            this.Employees[i].day_without_project = 0;
                            this.findFreeEmployees();
                        });
                    this.Projects.push(proj);
                    return false;
                }
            }
        return proj;
    }
}

class Log {
    constructor(){
        this.completed=0;
        this.hired=0;
        this.fired=0;
    }
    collectData(depart_test,depart_1,depart_2){ 
        this.fired = depart_1.fired_employees + depart_2.fired_employees;
        this.hired = depart_1.hired_employees + depart_2.hired_employees;
        this.completed = depart_test.completed_projects;
    }
}

module.exports.LetsWork = function(day) {
    let current_day = 0;
    const Boss = new Director();
    const Mobile = new Mob_Department();
    const Web = new Department("web");
    const Test = new Department("test");
    const Statistics = new Log();

    for ( current_day; current_day < day; current_day++) {
        let c_new_proj = randomInteger(0, 4);
        for (c_new_proj; c_new_proj > 0; c_new_proj--) {
            Boss.new_projects.push(createRandomProject());
        }
        Boss.sendToDev(Mobile);
        Boss.sendToDev(Web);
        Boss.sendToTest(Test,Mobile);
        Boss.sendToTest(Test,Web);
        Boss.dismissEmployees(Mobile,Web,Test);
        Boss.deleteCompletedProjects(Mobile,Web,Test);
        Boss.newDay(Mobile,Web,Test);
        }
    Statistics.collectData(Test,Mobile,Web);
    return JSON.stringify(Statistics);
}
