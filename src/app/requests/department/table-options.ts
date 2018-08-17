import { Request } from './../../models/request.model';

class DepartmentTableOptions {

  search = [{
    name: 'Request ID',
    run(source: Request[], keyword) {
      return source.filter(req => req.id == keyword)
    }
  }, {
    name: 'GTID',
    run(source: Request[], keyword) {
      return source.filter(req => req.student.gtID == keyword)
    }
  }, {
    name: 'Name (Student)',
    run(source: Request[], keyword: string) {
      return source.filter(req => {
        const name = req.student.name.toLowerCase();
        return name.includes(keyword.toLowerCase());
      })
    }
  }, {
    name: 'School',
    run(source: Request[], keyword: string) {
      return source.filter(req => {
        const name = req.course.school.name.toLowerCase();
        return name.includes(keyword.toLowerCase());
      })
    }
  }];

  filter = [{
    name: 'Registrar staff',
    retrieve: {
      item: 'staff',
      query: { deptID: 50 }
    },
    run(source: Request[], value: any) {
      return source.filter(req => {
        if (req.registrar) return req.registrar.id == value.id;
        return false;
      })
    }
  }, {
    name: 'Admission',
    retrieve: null,
    has: [{
      id: 0, name: 'N/A'
    }, {
      id: 1, name: 'Required'
    }],
    run(source: Request[], value: any) {
      console.log(value);
      console.log(source);
      if (value.id === 1) {
        return source.filter(req => {
          return req.admissionRequired ? true : false;
        });
      }
      if (value.id === 0) {
        return source.filter(req => {
          return req.admissionRequired ? false : true;
        });
      }
    }
  }, {
    name: 'Status',
    retrieve: {
      item: 'status',
      query: null
    },
    run(source: Request[], value: any) {
      return source.filter(req => {
        return req.statusID == value.id;
      })
    }
  }, {
    name: 'Date',
    retrieve: null,
    has: [
      new Date(2018, 8, 1, 0, 0, 0, 0),
      new Date()
    ],
    run(source: Request[], date: Date[]) {
      const [start, end] = date;
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return source.filter(req => {
        const created = new Date(req.created_at.replace(/\s/, 'T'));
        return created >= start && created <= end;
      })
    }
  }];

  sort = [{
    name: 'ID (asc)',
    run(source: Request[]) {
      return source.slice();
    }
  }, {
    name: 'ID (desc)',
    run(source: Request[]) {
      return source.slice().reverse();
    }
  }, {
    name: 'Queue (asc)',
    run(source: Request[]) {
      return source.slice().sort((a, b) => {
        const notBigger = b.inQueue  > a.inQueue ? -1 : 0;
        return a.inQueue > b.inQueue ? 1 : notBigger;
      })
    }
  }, {
    name: 'Queue (desc)',
    run(source: Request[]) {
      return source.slice().sort((a, b) => {
        const notBigger = a.inQueue  > b.inQueue ? -1 : 0;
        return b.inQueue > a.inQueue ? 1 : notBigger;
      })
    }
  }];

  // private checkIfMatch(target: any, given: any) {
  //   return target == given;
  // }
  //
  // private checkIfInclude(target: string, given: string) {
  //   return target.toLowerCase().includes(given.toLowerCase());
  // }

}

export { DepartmentTableOptions as TableOptions };
