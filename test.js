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
        this.day_to_dev = 0;
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
            while (this.def_Projects.length) {
                let i = this.def_Projects.length -1;
                const proj = this.def_Projects[i];
                if (department.direction === proj.direction) {
                    if (department.takeProject(proj)) {
                        department.addEmployee();
                    }
                    department.takeProject(proj);
                    this.def_Projects.splice(i, i);
                }
            }
        }else {
            if (this.new_projects.length) {
                while (this.new_projects.length) {
                    let n = this.new_projects.length - 1;
                    const proj = this.new_projects[n];
                    if (department.direction === proj.direction) {
                        if (department.takeProject(proj)) {
                            this.def_Projects.push(proj);
                        }
                        this.new_projects.splice(n, n);
                    }
                }
            }
        }
    }

    sendToTest(test_department,department) {
        if (this.Projects_to_test.length) {
            while (this.Projects_to_test.length){
                const old_proj = this.Projects_to_test.pop();
                if (test_department.takeProject(old_proj)) {
                    test_department.addEmployee();
                }
                test_department.takeProject(old_proj);
                }
        } else {
            if(department.findFinProject){
                while (department.findFinProject()){
                    const proj = department.findFinProject();
                    if (test_departments.takeProject(proj)) {
                        this.Projects_to_test.push(proj);
                    }
                }
            }
        }
    }

    newDay (depart_1,depart_2,depart_3) {
        depart_1.nextDay();
        depart_2.nextDay();
        depart_3.nextDay();
    }

    dismissEmployees(depart_1,depart_2,depart_3) {
        department.deleteEmloyees();
        department.deleteEmloyees();
        department.deleteEmloyees();
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
        this.Employees.push(new Employee);
        this.hired_employees++;
    }

    deleteEmloyees() {
        let min_exp = Infinity;
        let bad_empl;
        for (let i = 0; e < this.Employees.length; e++) {
            if (this.Employees[e].day_without_project == 3) {
                if (min_exp > this.Employees[e].exp) {
                    bad_empl = e;
                }
            }
        }
        if (bad_empl_indx) {
            this.Employees.splice(bad_empl, bad_empl);
            this.fired_employees++;
        }
    }
    
    findFreeEmployees() {
        let free_index;
        this.free_employees = 0;
        for (let e = 0; e < this.Employees.length; e++) {
            if (this.Employees[e].on_work == 0) {
                this.free_employees ++ ;
                free_index = e;              
            }
        }
        return free_index;
    }

    deleteProjects() {
        let p = 0;
        while (p < this.Projects.length) {
            if (this.Projects[p].day_to_dev <= 0) {
                this.Projects.splice(p, p);
                this.completed_projects++;
            } else {
                p++;
            }
        }
    }

    takeProject(project) {
        const proj = project;
        let e_indx = this.findFreeEmployees();
        if (proj.direction === this.direction) {
            if (e_indx >= 0) {
                proj.team++;
                proj.day_to_dev = proj.complexity/proj.team;
                this.Projects.push(proj);
                this.Employees[e_indx].exp++;
                this.Employees[e_indx].day_without_project = 0, 
                this.Employees[e_indx].on_work = proj.day_to_dev;
                this.findFreeEmployees();
                return false;
            }
        }
        return proj;    
    }

    findFinProject() {
        let ind;
        for ( let fp = 0; fp < this.Projects.length; fp++) {
            if (this.Projects[fp].day_to_dev == 0) {
                ind = fp;
                break;
            }
        }
        const proj = this.Projects[ind];
        this.Projects[ind].day_to_dev = -1;
        proj.direction = "test";
        return proj;
    }

    nextDay() {
        for (let emp=0; emp < this.Employees.length; emp++) {
            if (this.Employees[emp].on_work == 0) {
                this.Employees[emp].day_without_project++;
            } else {
                this.Employees[emp].on_work--;
            }
        }
        for (let prj=0; prj < this.Projects.length; prj++) {
            this.Projects[prj].day_to_dev--;
        }
    }
}

class Mob_Department extends Department {
    constructor(){
        super ("mobile");
    }

    takeProject(project) {
        const proj = project;
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
        this.fired=0;
        this.hired=0;
        this.finished=0;
    }
    collectData(depart_test,depart_1,depart_2){ 
        this.fired += depart_1.fired_employees + depart_2.fired_employees;
        this.hired += depart_2.hired_employees + depart_3.hired_employees;
        this.finished = depart_test.completed_projects;
    }
}

function LetsWork(day) {
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
        Boss.deleteEmloyees(Mobile,Web,Test);
        Boss.newDay(Mobile,Web,Test)
         }
    Statistics.collectData(Test,Mobile,Web);
    console.log(Statistics);
}

LetsWork(5);
