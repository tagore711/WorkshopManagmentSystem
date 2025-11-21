-- Table: area_incharge
CREATE TABLE area_incharge (
    "ID" INTEGER NOT NULL,
    "First Name" VARCHAR(50) NOT NULL,
    "Middle Name" VARCHAR(50) NOT NULL,
    "Last Name" VARCHAR(50) NOT NULL,
    PRIMARY KEY ("ID")
);
ALTER TABLE area_incharge ALTER COLUMN "Middle Name" DROP NOT NULL;
-- Table: area
CREATE TABLE area (
    area_name VARCHAR(20) NOT NULL,
    ic INTEGER,
    PRIMARY KEY (area_name),
    CONSTRAINT f1_ic
        FOREIGN KEY (ic)
        REFERENCES area_incharge ("ID")
        ON DELETE NO ACTION -- Area in charge must exist for an area
        ON UPDATE NO ACTION
);

-- Table: workshop
CREATE TABLE workshop (
    wk_code INTEGER NOT NULL,
    wk_name VARCHAR(45),
    area VARCHAR(20),
    manpower INTEGER,
    customer_visits INTEGER,
    recovery VARCHAR(10), -- e.g., 'yes' or 'no'
    score INTEGER,         -- Calculated via trigger
    PRIMARY KEY (wk_code),
    CONSTRAINT f2_area
        FOREIGN KEY (area)
        REFERENCES area (area_name)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- Table: workshop_ic
CREATE TABLE workshop_ic (
    id INTEGER NOT NULL,
    fname VARCHAR(45),
    mname VARCHAR(45),
    lname VARCHAR(45),
    rating INTEGER,
    area_ic INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT f3_area_ic
        FOREIGN KEY (area_ic)
        REFERENCES area_incharge ("ID")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

-- Table: manages (Associative Table)
CREATE TABLE manages (
    wk_code INTEGER NOT NULL,
    ic_id INTEGER NOT NULL,
    PRIMARY KEY (wk_code, ic_id),
    CONSTRAINT f4_wk_code
        FOREIGN KEY (wk_code)
        REFERENCES workshop (wk_code)
        ON DELETE CASCADE -- If workshop is deleted, remove manages entry
        ON UPDATE NO ACTION,
    CONSTRAINT f5_ic_id
        FOREIGN KEY (ic_id)
        REFERENCES workshop_ic (id)
        ON DELETE CASCADE -- If workshop IC is deleted, remove manages entry
        ON UPDATE NO ACTION
);

-- Table: revenue
CREATE TABLE revenue (
    wk_code INTEGER NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    total_sales INTEGER,
    service_cost INTEGER,
    profit INTEGER, -- Calculated via trigger
    PRIMARY KEY (wk_code, year, quarter),
    CONSTRAINT f6_wk_code_rev
        FOREIGN KEY (wk_code)
        REFERENCES workshop (wk_code)
        ON DELETE CASCADE -- If workshop is deleted, remove revenue entries
        ON UPDATE NO ACTION
);


-- Function to calculate workshop score
CREATE OR REPLACE FUNCTION calculate_workshop_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Logic: FLOOR((manpower / 100 * 4) + (customer_visits / 1000 * 4) + (recovery = 'yes' ? 2 : 0))
    NEW.score := FLOOR(
        (NEW.manpower::numeric / 100 * 4) +
        (NEW.customer_visits::numeric / 1000 * 4) +
        (CASE WHEN NEW.recovery = 'yes' THEN 2 ELSE 0 END)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger attached to the workshop table
CREATE TRIGGER score_calculation
BEFORE INSERT OR UPDATE OF manpower, customer_visits, recovery ON workshop
FOR EACH ROW
EXECUTE FUNCTION calculate_workshop_score();



-- Function to adjust revenue profit
CREATE OR REPLACE FUNCTION calculate_revenue_profit()
RETURNS TRIGGER AS $$
BEGIN
    -- Logic: NEW.profit = NEW.total_sales - NEW.service_cost
    NEW.profit := NEW.total_sales - NEW.service_cost;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger attached to the revenue table
CREATE TRIGGER profit_adjust
BEFORE INSERT OR UPDATE OF total_sales, service_cost ON revenue
FOR EACH ROW
EXECUTE FUNCTION calculate_revenue_profit();


-- Stored Procedure/Function for Insert_Revenue
CREATE OR REPLACE FUNCTION insert_revenue_sp(
    p_wk_code INTEGER,
    p_year INTEGER,
    p_quarter INTEGER,
    p_total_sales INTEGER,
    p_service_cost INTEGER,
    p_profit INTEGER -- The profit argument will be overwritten by the trigger
)
RETURNS void AS $$
BEGIN
    INSERT INTO revenue (wk_code, year, quarter, total_sales, service_cost, profit)
    VALUES (p_wk_code, p_year, p_quarter, p_total_sales, p_service_cost, p_profit);
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure/Function for fetching all revenues
CREATE OR REPLACE FUNCTION fetching_all_revenues_sp()
RETURNS SETOF revenue AS $$
BEGIN
    RETURN QUERY SELECT * FROM revenue;
END;
$$ LANGUAGE plpgsql;




