package interview;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StudentMain {

	public static void main(String[] args) {
		Student student1= new Student(9, "sujesh", Arrays.asList("java", "python"));
		Student student2= new Student(6, "sujesh2", Arrays.asList("java"));
		Student student3= new Student(5, "sujesh3", Arrays.asList());
		Student student4= new Student(8, "sujesh4", Arrays.asList("java", "python"));
		Student student5= new Student(10, "sujesh5", Arrays.asList("java", "python"));
		List<Student> studentList= new ArrayList<>();
		studentList.add(student1);
		studentList.add(student2);
		studentList.add(student3);
		studentList.add(student4);
		studentList.add(student5);

		List<Student> level1= studentList.stream().filter(s->{
			if((s.grade>8||s.grade>9)&& s.skills.size()>1) {
				return true;
			}else {
				return false;
			}
		}).collect(Collectors.toList());
		List<Student> level2= studentList.stream().filter(s->{
			if((s.grade>9||s.grade>8)&& s.skills.size()==1) {
				return true;
			}else {
				return false;
			}
		}).collect(Collectors.toList());
		List<Student> level4= studentList.stream().filter(s->{
			if(s.skills.size()==0) {
				return true;
			}else {
				return false;
			}
		}).collect(Collectors.toList());
		List<Student> level3= studentList.stream().filter(s->{
			if(s.grade==8&&s.skills.size()>=1) {
				return true;
			}else {
				return false;
			}
		}).collect(Collectors.toList());
	}

}
class Student{
	int grade;
	String name;
	List<String> skills;
	public Student(int grade, String name, List<String> skills) {
		super();
		this.grade = grade;
		this.name = name;
		this.skills = skills;
	}
	
}