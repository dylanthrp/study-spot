// Independent numeric checks for the authored lesson/practice parameters.
// This does not parse arbitrary student math or certify instructor quiz coverage.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const data=vm.runInNewContext(fs.readFileSync('calc3-data.js','utf8')+';CALC3_DATA');
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const norm=a=>Math.sqrt(dot(a,a));
const scale=(a,k)=>a.map(x=>x*k);
const unit=a=>scale(a,1/norm(a));
// atan2 avoids acos sensitivity to floating-point drift near ±1.
const angle=(a,b)=>Math.atan2(norm(cross(a,b)),dot(a,b))*180/Math.PI;
const projection=(a,b)=>scale(b,dot(a,b)/dot(b,b));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const vector=(a,b)=>a.forEach((x,i)=>near(x,b[i]));
// Eight guided worked examples, including intermediate checks.
vector(sub([4,2,1],[1,-2,1]),[3,4,0]); near(norm([3,4,0]),5); vector(unit([3,4,0]),[.6,.8,0]);
near(dot([2,-3,1],[4,1,-2]),3);
near(angle([1,1,0],[0,1,1]),60); near(angle([1,1,0],[1,0,0]),45); near(angle([1,1,0],[0,1,0]),45); near(angle([1,1,0],[0,0,1]),90);
near(dot([3,-1,2],[0,2,0])/norm([0,2,0]),-1); vector(projection([3,-1,2],[0,2,0]),[0,-1,0]); near(dot([3,0,2],[0,2,0]),0);
vector(cross([1,2,0],[0,1,2]),[4,-2,1]); near(norm([4,-2,1]),Math.sqrt(21)); near(dot([4,-2,1],[1,2,0]),0); near(dot([4,-2,1],[0,1,2]),0);
vector(cross(sub([3,1,1],[1,0,1]),sub([1,2,3],[1,0,1])),[2,-4,4]); near(norm([2,-4,4])/2,3);
vector(cross([1,3,0],[0,1,4]),[12,-4,1]); near(dot([2,0,0],[12,-4,1]),24); near(dot([2,0,0],cross([1,3,0],[3,3,0])),0);
near(dot([3,4,0],[2,0,0]),6); vector(cross([0,2,0],[3,4,0]),[0,0,-6]);
// Twelve question computations, independent of the selected-index lookup.
vector(unit(sub([1,-1,6],[-1,2,0])),[2/7,-3/7,6/7]);
near(dot([1,-2,3],[4,1,-1]),-1); near(dot([2,5,1],[3,-2,4]),0);
near(angle([1,0,1],[-2,0,-2]),180); vector(unit([2,-1,2]),[2/3,-1/3,2/3]);
near(dot([1,-3,2],[0,4,0])/norm([0,4,0]),-3); vector(projection([4,2,1],[1,1,0]),[3,3,0]);
vector(unit(cross([1,0,0],[0,3,4])),[0,-4/5,3/5]);
near(norm(cross(sub([4,1,1],[1,1,1]),sub([1,3,1],[1,1,1])))/2,3);
near(dot([1,2,0],cross([0,1,1],[1,3,1])),0);
near(dot([-2,5,0],[3,0,0]),-6); vector(cross([2,0,0],[0,-3,0]),[0,0,-6]);
const answers=['⟨2/7, −3/7, 6/7⟩','−1','5','180°','(2/3, −1/3, 2/3)','−3','⟨3, 3, 0⟩','⟨0, −4/5, 3/5⟩','3 square units','0 cubic units; coplanar','−6 J','⟨0, 0, −6⟩ N·m'];
assert.equal(data.questions.length,answers.length);
assert.equal(data.lessons.length,8);
const ids=new Set(data.lessons.map(l=>l.id));
data.questions.forEach((q,i)=>{assert.equal(q.options[q.correct],answers[i]);assert.equal(new Set(q.options).size,4);assert.ok(ids.has(q.lesson));assert.ok(q.explanation.length>30);});
assert.equal(new Set(data.questions.map(q=>q.id)).size,12);
// Boundary cases: opposite direction is 180°, not strictly obtuse.
near(angle([-1,0,0],[1,0,0]),180); near(angle([1,0,0],[1,0,0]),0); near(angle([1,0,0],[0,1,0]),90);
assert.ok(data.lessons.find(l=>l.id==='angle').check.includes('at most 180°'));
console.log('PASS: 8 worked examples, 12 computed answer keys, choice uniqueness, lesson references, and angle boundaries.');
