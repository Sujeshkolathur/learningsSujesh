package interview;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class HashCodeEqualsContract {

	public static void main(String[] args) {
		Set<Person> persons = new HashSet<>();
		Person person1 = new Person("sujesh");
		Person person2 = new Person("sujesh");
		persons.add(person1);
		persons.add(person2);
		System.out.println(persons.size());
		
		
		Set<PersonV2> personsv2 = new HashSet<>();
		PersonV2 person3 = new PersonV2("sujith");
		PersonV2 person4 = new PersonV2("sujith");
		personsv2.add(person3);
		personsv2.add(person4);
		System.out.println(personsv2.size());

	}

}

class Person{
	String name;

	public Person(String name) {
		super();
		this.name = name;
	}
	
}
class PersonV2 {
    String name;

    public PersonV2(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        PersonV2 other = (PersonV2) obj;
        return Objects.equals(this.name, other.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}